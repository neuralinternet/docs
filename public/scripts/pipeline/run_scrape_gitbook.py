import asyncio
import os
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from markdownify import markdownify as md

# The URL of the GitBook to scrape.
BASE_URL = 'https://docs.neuralinternet.ai/'

# The directory where the scraped Markdown files will be saved.
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'new pages', 'from_gitbook')

def sanitize_filename(title):
    """Sanitizes a string to be a valid filename."""
    # Replace special characters and spaces with underscores
    s_title = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip()
    s_title = re.sub(r'[-\s]+', '_', s_title)
    return f"{s_title.lower()}.md"

async def main():
    """
    Main function to scrape the GitBook site.
    """
    print("Starting GitBook scraper...")
    
    if not os.path.exists(OUTPUT_DIR):
        print(f"Creating output directory: {OUTPUT_DIR}")
        os.makedirs(OUTPUT_DIR)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print(f"Navigating to {BASE_URL}...")
        await page.goto(BASE_URL, wait_until='networkidle', timeout=60000)

        print("Expanding all collapsible navigation menus...")
        # Based on HTML analysis, expandable links contain a chevron icon.
        # Using a raw string r'' to avoid syntax warnings with escapes.
        expandable_links = await page.query_selector_all(r'a.group\/toclink:has(svg[style*="chevron-right"])')
        
        for link in expandable_links:
            try:
                if await link.is_visible():
                    await link.click()
                    await page.wait_for_timeout(200) # Give it a moment to expand
            except Exception as e:
                print(f"Could not click expandable link: {e}")

        print("Collecting all page links from the navigation...")
        # The navigation is inside an <aside> with data-testid="table-of-contents"
        nav_container_selector = 'aside[data-testid="table-of-contents"]'
        await page.wait_for_selector(nav_container_selector, timeout=30000)
        nav_container = await page.query_selector(nav_container_selector)

        links = await nav_container.eval_on_selector_all(
            'a',
            """
            (anchors) =>
                anchors
                    .map(a => ({
                        href: a.href,
                        title: a.innerText.trim()
                    }))
                    .filter(l => l.title && l.href && !l.href.includes('gitbook.com'))
            """
        )

        unique_links = []
        seen_urls = set()
        for link in links:
            # Normalize URL by removing trailing slash
            normalized_url = link['href'].rstrip('/')
            if normalized_url not in seen_urls:
                unique_links.append(link)
                seen_urls.add(normalized_url)

        print(f"Found {len(unique_links)} unique pages to scrape.")

        for link in unique_links:
            url = link['href']
            title = link['title']

            print(f"Scraping '{title}' ({url})...")
            try:
                await page.goto(url, wait_until='networkidle', timeout=60000)
                
                # The main content is inside the <main> tag.
                content_selector = 'main'
                await page.wait_for_selector(content_selector, timeout=10000)
                
                html_content = await page.inner_html(content_selector)
                soup = BeautifulSoup(html_content, 'html.parser')

                # Remove breadcrumbs, headers, and footer navigation
                for nav in soup.select('nav'):
                    nav.decompose()
                for header in soup.select('header'):
                    header.decompose()
                
                markdown_content = md(str(soup), heading_style='ATX', bullets='*').strip()
                
                # Add a frontmatter title for Astro
                final_content = f'---\ntitle: "{title}"\n---\n\n{markdown_content}'

                filename = sanitize_filename(title)
                filepath = os.path.join(OUTPUT_DIR, filename)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(final_content)
                
                print(f"  -> Saved to {filepath}")

            except Exception as e:
                print(f"  -> Error scraping {url}: {e}")

        print("Scraping complete!")
        await browser.close()

if __name__ == '__main__':
    print("This script requires Playwright, BeautifulSoup4, and Markdownify.")
    print("Please install them using pip: pip install playwright beautifulsoup4 markdownify")
    print("You also need to install the browser binaries for Playwright: playwright install")
    print("-" * 20)
    
    asyncio.run(main()) 