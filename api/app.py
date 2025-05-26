from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os
from typing import Optional, Dict, Any

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Football-Data.org API Configuration
FOOTBALL_API_KEY = os.environ.get('FOOTBALL_API_KEY', 'd8be02272bce415a9475117730502550')
FOOTBALL_API_BASE = "https://api.football-data.org/v4"

# Team mapping: Your frontend team names -> Football-Data.org team IDs
TEAM_MAPPING = {
    # Premier League
    'Arsenal': 57,
    'Chelsea': 61,
    'Liverpool': 64,
    'Manchester City': 65,
    'Manchester United': 66,
    'Tottenham': 73,
    
    # La Liga
    'Real Madrid': 86,
    'Barcelona': 81,
    'Atletico Madrid': 78,
    'Sevilla': 559,
    'Valencia': 95,
    'Real Sociedad': 92,
    
    # Serie A
    'Juventus': 109,
    'AC Milan': 98,
    'Inter Milan': 108,
    'Roma': 113,
    'Napoli': 113,
    'Lazio': 110,
    
    # Bundesliga
    'Bayern Munich': 5,
    'Borussia Dortmund': 4,
    'RB Leipzig': 721,
    'Bayer Leverkusen': 3,
    'Eintracht Frankfurt': 19,
    'Wolfsburg': 11,
    
    # Ligue 1
    'Paris Saint-Germain': 524,
    'Marseille': 516,
    'Lyon': 523,
    'Monaco': 548,
    'Nice': 522,
    'Lille': 521
}

# Stadium mapping for enhanced data
STADIUM_MAPPING = {
    'Arsenal': 'Emirates Stadium',
    'Chelsea': 'Stamford Bridge',
    'Liverpool': 'Anfield',
    'Manchester City': 'Etihad Stadium',
    'Manchester United': 'Old Trafford',
    'Tottenham': 'Tottenham Hotspur Stadium',
    'Real Madrid': 'Santiago Bernabéu',
    'Barcelona': 'Camp Nou',
    'Atletico Madrid': 'Wanda Metropolitano',
    'Juventus': 'Allianz Stadium',
    'AC Milan': 'San Siro',
    'Inter Milan': 'San Siro',
    'Bayern Munich': 'Allianz Arena',
    'Borussia Dortmund': 'Signal Iduna Park',
    'Paris Saint-Germain': 'Parc des Princes'
}

def make_api_request(endpoint: str) -> Optional[Dict[Any, Any]]:
    """Make request to Football-Data.org API with proper headers"""
    headers = {
        'X-Auth-Token': FOOTBALL_API_KEY,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{FOOTBALL_API_BASE}{endpoint}", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None

def format_match_data(matches_data: Dict[Any, Any], team_name: str) -> list:
    """Format API response to match frontend expectations"""
    if not matches_data or 'matches' not in matches_data:
        return []
    
    formatted_matches = []
    
    for match in matches_data['matches']:
        # Include both scheduled and finished matches for testing
        if match['status'] not in ['SCHEDULED', 'FINISHED', 'IN_PLAY', 'PAUSED']:
            continue
            
        # Extract team names
        home_team = match['homeTeam']['name']
        away_team = match['awayTeam']['name']
        
        # Format date and time
        match_datetime = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
        match_date = match_datetime.strftime('%Y-%m-%d')
        match_time = match_datetime.strftime('%H:%M')
        
        # Determine venue and city
        venue = match.get('venue') or STADIUM_MAPPING.get(home_team, f"{home_team} Stadium")
        
        # City mapping based on team
        city_mapping = {
            'Arsenal': 'London', 'Chelsea': 'London', 'Tottenham': 'London',
            'Manchester City': 'Manchester', 'Manchester United': 'Manchester',
            'Liverpool': 'Liverpool', 'Real Madrid': 'Madrid', 'Barcelona': 'Barcelona',
            'Atletico Madrid': 'Madrid', 'Juventus': 'Turin', 'AC Milan': 'Milan',
            'Inter Milan': 'Milan', 'Roma': 'Rome', 'Napoli': 'Naples',
            'Bayern Munich': 'Munich', 'Borussia Dortmund': 'Dortmund',
            'Paris Saint-Germain': 'Paris', 'Marseille': 'Marseille'
        }
        
        city = city_mapping.get(home_team, home_team.split()[-1])
        
        # Calculate realistic ticket pricing
        base_prices = {
            'Real Madrid': 120, 'Barcelona': 110, 'Bayern Munich': 90,
            'Manchester United': 100, 'Manchester City': 95, 'Arsenal': 85,
            'Liverpool': 90, 'Chelsea': 85, 'Juventus': 80, 'AC Milan': 75,
            'Paris Saint-Germain': 95
        }
        base_price = base_prices.get(home_team, 65)
        min_price = base_price
        max_price = int(base_price * 2.5)
        
        formatted_match = {
            'id': match['id'],
            'homeTeam': home_team,
            'awayTeam': away_team,
            'homeTeamCrest': match['homeTeam'].get('crest'),
            'awayTeamCrest': match['awayTeam'].get('crest'),
            'date': match_date,
            'time': match_time,
            'competition': match['competition']['name'],
            'competitionCode': match['competition']['code'],
            'competitionEmblem': match['competition'].get('emblem'),
            'stadium': venue,
            'city': city,
            'country': match['area']['name'],
            'minPrice': min_price,
            'maxPrice': max_price,
            'currency': 'EUR',
            'status': match['status'],
            'matchday': match.get('matchday'),
            'season': match['season']['startDate'][:4]
        }
        
        formatted_matches.append(formatted_match)
    
    return formatted_matches

def get_mock_matches(team_name: str) -> list:
    """Fallback mock data if API fails"""
    base_date = datetime.now() + timedelta(days=7)
    
    mock_opponents = {
        'Arsenal': ['Chelsea', 'Liverpool', 'Manchester United'],
        'Chelsea': ['Arsenal', 'Tottenham', 'Manchester City'],
        'Real Madrid': ['Barcelona', 'Atletico Madrid', 'Sevilla'],
        'Barcelona': ['Real Madrid', 'Valencia', 'Atletico Madrid'],
        'Bayern Munich': ['Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen']
    }
    
    opponents = mock_opponents.get(team_name, ['Team A', 'Team B', 'Team C'])
    mock_matches = []
    
    for i, opponent in enumerate(opponents):
        match_date = (base_date + timedelta(days=i*7)).strftime('%Y-%m-%d')
        mock_match = {
            'id': f'mock_{i+1}',
            'homeTeam': team_name,
            'awayTeam': opponent,
            'date': match_date,
            'time': '15:00',
            'competition': 'Premier League',
            'stadium': STADIUM_MAPPING.get(team_name, f'{team_name} Stadium'),
            'city': 'London',
            'country': 'England',
            'minPrice': 65,
            'maxPrice': 180,
            'currency': 'EUR',
            'status': 'SCHEDULED',
            'source': 'mock_data'
        }
        mock_matches.append(mock_match)
    
    return mock_matches

@app.route('/api/matches', methods=['GET'])
def get_matches():
    """
    Get matches for a specific team
    Query parameters:
    - team: Team name (required)
    - dateFrom: Start date (optional, format: YYYY-MM-DD)
    - dateTo: End date (optional, format: YYYY-MM-DD)
    """
    team_name = request.args.get('team')
    date_from = request.args.get('dateFrom')
    date_to = request.args.get('dateTo')
    
    if not team_name:
        return jsonify({'error': 'Team parameter is required'}), 400
    
    # Check if team is supported
    if team_name not in TEAM_MAPPING:
        return jsonify({
            'error': f'Team "{team_name}" not supported',
            'supported_teams': list(TEAM_MAPPING.keys())
        }), 400
    
    team_id = TEAM_MAPPING[team_name]
    
    # Build API endpoint
    endpoint = f"/teams/{team_id}/matches"
    
    # Add date filters if provided
    params = []
    if date_from:
        params.append(f"dateFrom={date_from}")
    if date_to:
        params.append(f"dateTo={date_to}")
    
    if params:
        endpoint += "?" + "&".join(params)
    
    # Try to get data from API
    api_data = make_api_request(endpoint)
    
    if api_data:
        # Success - format and return real data
        matches = format_match_data(api_data, team_name)
        return jsonify({
            'success': True,
            'source': 'football-data.org',
            'team': team_name,
            'matches': matches,
            'total': len(matches),
            'filters': {
                'dateFrom': date_from,
                'dateTo': date_to
            }
        })
    else:
        # API failed - return mock data
        mock_matches = get_mock_matches(team_name)
        return jsonify({
            'success': True,
            'source': 'mock_data',
            'team': team_name,
            'matches': mock_matches,
            'total': len(mock_matches),
            'note': 'Using fallback data - API unavailable',
            'filters': {
                'dateFrom': date_from,
                'dateTo': date_to
            }
        })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

# This is required for Vercel
if __name__ != '__main__':
    # When running on Vercel, expose the app
    handler = app
else:
    # When running locally
    app.run(debug=True, host='0.0.0.0', port=5000)