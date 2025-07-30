import pandas as pd
import json

# 读取数据
ranking_all = pd.read_csv('../data/proceed/ranking_all.csv')
players = pd.read_csv('../data/raw/wta_players.csv')

# 筛选时间
ranking_all = ranking_all[ranking_all['ranking_date'] > '1990-01-01']

# 合并姓名
players['name'] = players['name_first'] + ' ' + players['name_last']
df = ranking_all.merge(players[['player_id', 'name']], left_on='player', right_on='player_id', how='left')

# 日期处理
df['ranking_date'] = pd.to_datetime(df['ranking_date'])
df['year'] = df['ranking_date'].dt.year
df['month'] = df['ranking_date'].dt.month

# 选每月第一天的记录
df = df.sort_values('ranking_date')
first_dates = df.groupby(['year', 'month'])['ranking_date'].first().reset_index()
df = df.merge(first_dates, on=['year', 'month', 'ranking_date'])

# 只要前10名
df = df[df['rank'] <= 10].copy()

# 日期转字符串
df['date_str'] = df['ranking_date'].dt.strftime('%Y-%m-%d')

# 构造结果
result = {}

for date_str, group in df.groupby('date_str'):
    group = group.sort_values('rank')
    second_points = group.iloc[1]['points'] if len(group) > 1 else None
    default_value = int(second_points) + 10 if pd.notna(second_points) else 10

    result[date_str] = {
        row['name']: int(row['points']) if pd.notna(row['points']) else default_value
        for _, row in group.iterrows()
    }

# 导出 JSON
with open('../web/wta/public/data/top10.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
