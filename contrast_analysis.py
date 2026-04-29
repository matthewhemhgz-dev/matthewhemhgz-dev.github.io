from playwright.sync_api import sync_playwright
import json

# WCAG contrast ratios
WCAG_AA_NORMAL = 4.5
WCAG_AA_LARGE = 3.0
WCAG_AAA_NORMAL = 7.0
WCAG_AAA_LARGE = 4.5

def get_luminance(rgb):
    """Calculate relative luminance from RGB values"""
    r, g, b = [x / 255 for x in rgb]
    
    def linearize(v):
        if v <= 0.03928:
            return v / 12.92
        else:
            return ((v + 0.055) / 1.055) ** 2.4
    
    r_lin = linearize(r)
    g_lin = linearize(g)
    b_lin = linearize(b)
    
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin

def get_contrast_ratio(luminance1, luminance2):
    """Calculate contrast ratio between two luminance values"""
    lighter = max(luminance1, luminance2)
    darker = min(luminance1, luminance2)
    return (lighter + 0.05) / (darker + 0.05)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def analyze_contrast():
    results = {
        'pages': [],
        'issues': []
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to the website
        page.goto('http://localhost:4328/')
        page.wait_for_load_state('networkidle')
        
        # Take a screenshot for reference
        page.screenshot(path='/workspace/website_screenshot.png', full_page=True)
        
        # Get page title
        page_title = page.title()
        
        page_result = {
            'url': 'http://localhost:4328/',
            'title': page_title,
            'elements': []
        }
        
        # Analyze text elements
        text_elements = page.locator('*').filter(has_text=True).all()
        for i, element in enumerate(text_elements[:50]):  # Limit to 50 elements
            try:
                text = element.text_content().strip()
                if not text or len(text) < 2:
                    continue
                
                # Get computed styles
                computed_style = element.evaluate('el => window.getComputedStyle(el)')
                color = computed_style.get('color', '#000000')
                background_color = computed_style.get('backgroundColor', '#ffffff')
                font_size = computed_style.get('fontSize', '16px')
                font_weight = computed_style.get('fontWeight', '400')
                
                # Extract RGB values
                if color.startswith('rgb'):
                    color_rgb = tuple(map(int, color.replace('rgb(', '').replace(')', '').split(',')))
                else:
                    color_rgb = hex_to_rgb(color)
                
                if background_color.startswith('rgb'):
                    bg_rgb = tuple(map(int, background_color.replace('rgb(', '').replace(')', '').split(',')))
                else:
                    bg_rgb = hex_to_rgb(background_color)
                
                # Calculate luminance and contrast ratio
                text_luminance = get_luminance(color_rgb)
                bg_luminance = get_luminance(bg_rgb)
                contrast_ratio = get_contrast_ratio(text_luminance, bg_luminance)
                
                # Determine if text is large
                font_size_px = float(font_size.replace('px', ''))
                is_large = font_size_px >= 18 or (font_size_px >= 14 and font_weight in ['bold', '700'])
                
                # Check WCAG compliance
                aa_compliant = contrast_ratio >= (WCAG_AA_LARGE if is_large else WCAG_AA_NORMAL)
                aaa_compliant = contrast_ratio >= (WCAG_AAA_LARGE if is_large else WCAG_AAA_NORMAL)
                
                element_info = {
                    'type': 'text',
                    'text': text[:100],  # Truncate long text
                    'color': color,
                    'background_color': background_color,
                    'font_size': font_size,
                    'font_weight': font_weight,
                    'is_large': is_large,
                    'contrast_ratio': round(contrast_ratio, 2),
                    'wcag_aa_compliant': aa_compliant,
                    'wcag_aaa_compliant': aaa_compliant
                }
                
                page_result['elements'].append(element_info)
                
                # Add to issues if not AA compliant
                if not aa_compliant:
                    results['issues'].append({
                        'type': 'text_contrast',
                        'element': text[:50],
                        'contrast_ratio': round(contrast_ratio, 2),
                        'required': WCAG_AA_LARGE if is_large else WCAG_AA_NORMAL,
                        'compliance': 'AA',
                        'location': 'http://localhost:4328/'
                    })
                    
            except Exception as e:
                continue
        
        # Analyze interactive elements (buttons and links)
        interactive_selectors = ['button', 'a[href]', '[role="button"]']
        for selector in interactive_selectors:
            elements = page.locator(selector).all()
            for i, element in enumerate(elements[:20]):  # Limit to 20 elements
                try:
                    text = element.text_content().strip()
                    
                    # Get computed styles
                    computed_style = element.evaluate('el => window.getComputedStyle(el)')
                    color = computed_style.get('color', '#000000')
                    background_color = computed_style.get('backgroundColor', '#ffffff')
                    font_size = computed_style.get('fontSize', '16px')
                    font_weight = computed_style.get('fontWeight', '400')
                    
                    # Extract RGB values
                    if color.startswith('rgb'):
                        color_rgb = tuple(map(int, color.replace('rgb(', '').replace(')', '').split(',')))
                    else:
                        color_rgb = hex_to_rgb(color)
                    
                    if background_color.startswith('rgb'):
                        bg_rgb = tuple(map(int, background_color.replace('rgb(', '').replace(')', '').split(',')))
                    else:
                        bg_rgb = hex_to_rgb(background_color)
                    
                    # Calculate luminance and contrast ratio
                    text_luminance = get_luminance(color_rgb)
                    bg_luminance = get_luminance(bg_rgb)
                    contrast_ratio = get_contrast_ratio(text_luminance, bg_luminance)
                    
                    # Determine if text is large
                    font_size_px = float(font_size.replace('px', ''))
                    is_large = font_size_px >= 18 or (font_size_px >= 14 and font_weight in ['bold', '700'])
                    
                    # Check WCAG compliance
                    aa_compliant = contrast_ratio >= (WCAG_AA_LARGE if is_large else WCAG_AA_NORMAL)
                    aaa_compliant = contrast_ratio >= (WCAG_AAA_LARGE if is_large else WCAG_AAA_NORMAL)
                    
                    element_info = {
                        'type': 'interactive',
                        'tag': selector,
                        'text': text[:100],
                        'color': color,
                        'background_color': background_color,
                        'font_size': font_size,
                        'font_weight': font_weight,
                        'is_large': is_large,
                        'contrast_ratio': round(contrast_ratio, 2),
                        'wcag_aa_compliant': aa_compliant,
                        'wcag_aaa_compliant': aaa_compliant
                    }
                    
                    page_result['elements'].append(element_info)
                    
                    # Add to issues if not AA compliant
                    if not aa_compliant:
                        results['issues'].append({
                            'type': 'interactive_contrast',
                            'element': f"{selector}: {text[:50]}",
                            'contrast_ratio': round(contrast_ratio, 2),
                            'required': WCAG_AA_LARGE if is_large else WCAG_AA_NORMAL,
                            'compliance': 'AA',
                            'location': 'http://localhost:4328/'
                        })
                        
                except Exception as e:
                    continue
        
        results['pages'].append(page_result)
        browser.close()
    
    # Write results to JSON file
    with open('/workspace/contrast_analysis_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("Contrast analysis completed. Results saved to /workspace/contrast_analysis_results.json")
    print(f"Found {len(results['issues'])} contrast issues")

if __name__ == "__main__":
    analyze_contrast()
