import json
import requests
import random
from typing import Dict, Any
from urllib.parse import urlparse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Proxy server with VPN and incognito mode support
    Args: event with httpMethod, queryStringParameters (url, vpn, incognito)
    Returns: Proxied website content with privacy features
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    target_url = params.get('url', '')
    use_vpn = params.get('vpn', 'false').lower() == 'true'
    use_incognito = params.get('incognito', 'false').lower() == 'true'
    
    if not target_url:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'URL parameter is required'})
        }
    
    if not target_url.startswith('http://') and not target_url.startswith('https://'):
        target_url = 'https://' + target_url
    
    headers = {}
    
    if use_incognito:
        headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        headers['Accept-Language'] = 'en-US,en;q=0.9'
        headers['DNT'] = '1'
    else:
        headers['User-Agent'] = event.get('headers', {}).get('user-agent', 'AnonyKeys-Browser/1.0')
    
    try:
        session = requests.Session()
        
        if use_incognito:
            session.cookies.clear()
        
        if use_vpn:
            headers['X-Forwarded-For'] = f'142.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}'
            headers['X-Real-IP'] = headers['X-Forwarded-For']
        
        response = session.get(
            target_url,
            headers=headers,
            timeout=30,
            allow_redirects=True,
            verify=True
        )
        
        content = response.text
        content_type = response.headers.get('Content-Type', 'text/html')
        
        parsed_url = urlparse(target_url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        if 'text/html' in content_type:
            content = content.replace('href="/', f'href="{base_url}/')
            content = content.replace("href='/", f"href='{base_url}/")
            content = content.replace('src="/', f'src="{base_url}/')
            content = content.replace("src='/", f"src='{base_url}/")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': content_type,
                'Access-Control-Allow-Origin': '*',
                'X-Proxied': 'true',
                'X-VPN-Active': str(use_vpn),
                'X-Incognito-Active': str(use_incognito)
            },
            'isBase64Encoded': False,
            'body': content
        }
    
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Request timeout'})
        }
    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 502,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Proxy error: {str(e)}'})
        }