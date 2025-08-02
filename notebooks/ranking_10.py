import pandas as pd
import json

ranking_all = pd.read_csv('../data/proceed/ranking_all.csv')
players = pd.read_csv('../data/raw/wta_players.csv')

ranking_all = ranking_all[ranking_all['ranking_date'] > '1990-01-01']

players['name'] = players['name_first'] + ' ' + players['name_last']
df = ranking_all.merge(players[['player_id', 'name', 'ioc']], left_on='player', right_on='player_id', how='left')

df['ranking_date'] = pd.to_datetime(df['ranking_date'])
df['year'] = df['ranking_date'].dt.year
df['month'] = df['ranking_date'].dt.month

df = df.sort_values('ranking_date')
first_dates = df.groupby(['year', 'month'])['ranking_date'].first().reset_index()
df = df.merge(first_dates, on=['year', 'month', 'ranking_date'])

df = df[df['rank'] <= 10].copy()

df['date_str'] = df['ranking_date'].dt.strftime('%Y-%m-%d')

ioc_to_emoji = {
    "ARG": "🇦🇷",
    "AUS": "🇦🇺",
    "AUT": "🇦🇹",
    "BEL": "🇧🇪",
    "BLR": "🇧🇾",
    "BUL": "🇧🇬",
    "CAN": "🇨🇦",
    "CHN": "🇨🇳",
    "CRO": "🇭🇷",
    "CZE": "🇨🇿",
    "DEN": "🇩🇰",
    "ESP": "🇪🇸",
    "EST": "🇪🇪",
    "FRA": "🇫🇷",
    "GBR": "🇬🇧",
    "GER": "🇩🇪",
    "GRE": "🇬🇷",
    "HUN": "🇭🇺",
    "ITA": "🇮🇹",
    "JPN": "🇯🇵",
    "KAZ": "🇰🇿",
    "LAT": "🇱🇻",
    "NED": "🇳🇱",
    "POL": "🇵🇱",
    "ROU": "🇷🇴",
    "RSA": "🇿🇦",
    "RUS": "🇷🇺",
    "SRB": "🇷🇸",
    "SUI": "🇨🇭",
    "SVK": "🇸🇰",
    "TUN": "🇹🇳",
    "UKR": "🇺🇦",
    "USA": "🇺🇸",
}

ioc_to_color = {
    "ARG": "#75AADB",
    "AUS": "#00843D",
    "AUT": "#ED2939",
    "BEL": "#FF0000",
    "BLR": "#006A44",
    "BUL": "#00966E",
    "CAN": "#FF0000",
    "CHN": "#DE2910",
    "CRO": "#C8102E",
    "CZE": "#D7141A",
    "DEN": "#C60C30",
    "ESP": "#AA151B",
    "EST": "#0072CE",
    "FRA": "#0055A4",
    "GBR": "#00247D",
    "GER": "#000000",
    "GRE": "#007A33",
    "HUN": "#C8102E",
    "ITA": "#008C45",
    "JPN": "#BC002D",
    "KAZ": "#00A1DE",
    "LAT": "#9E3039",
    "NED": "#21468B",
    "POL": "#DC143C",
    "ROU": "#002B7F",
    "RSA": "#007849",
    "RUS": "#0033A0",
    "SRB": "#C8102E",
    "SUI": "#FF0000",
    "SVK": "#0B4EA0",
    "TUN": "#E70013",
    "UKR": "#0057B8",
    "USA": "#3C3B6E",
}

metadata_raw = df[['name', 'ioc']].drop_duplicates().set_index('name')['ioc'].to_dict()
metadata = {}
for name, ioc in metadata_raw.items():
    emoji = ioc_to_emoji.get(ioc, "")
    color = ioc_to_color.get(ioc, "#999999")
    metadata[name] = {
        "ioc": ioc,
        "emoji": emoji,
        "color": color,
    }

data = []
for date_str, group in df.groupby('date_str'):
    group = group.sort_values('rank')
    second_points = group.iloc[1]['points'] if len(group) > 1 else None
    default_value = int(second_points) + 10 if pd.notna(second_points) else 10

    players_list = [
        {
            "name": row['name'],
            "value": int(row['points']) if pd.notna(row['points']) else default_value
        }
        for _, row in group.iterrows()
    ]

    data.append({
        "date": date_str,
        "players": players_list
    })

result = {
    "metadata": metadata,
    "data": data,
}

with open('../web/wta/public/data/top10.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("JSON数据生成完成！")
