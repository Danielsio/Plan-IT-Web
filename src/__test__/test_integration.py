# test_integration.py
import pytest
from playwright.sync_api import Page, sync_playwright

@pytest.fixture(scope="module")
def browser():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        yield browser
        browser.close()

@pytest.fixture(scope="module")
def page(browser):
    page = browser.new_page()
    page.goto("http://localhost:3000")  # Replace the URL with the address where your Vite app is running.
    yield page
    page.close()

def test_app_title(page: Page):
    assert "PlanIT" in page.title()  # Replace "Your App Title" with the expected title of your app.
    login_button = page.locator('button:has-text("Login")')
    assert login_button.is_visible()

# test_about_page.py
def test_about_page_content(page):
    page.goto("http://localhost:3000/about")  # Adjust the URL accordingly if needed.
    assert "A company that creates personalized curricula for students" in page.inner_text("div.about-page-container p")
