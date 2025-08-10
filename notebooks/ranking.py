import pandas as pd

ranking_00s= pd.read_csv('../data/raw/wta_rankings_00s.csv')
ranking_10s= pd.read_csv('../data/raw/wta_rankings_10s.csv')
ranking_20s= pd.read_csv('../data/raw/wta_rankings_20s.csv')
ranking_80s= pd.read_csv('../data/raw/wta_rankings_80s.csv')
ranking_90s= pd.read_csv('../data/raw/wta_rankings_90s.csv')
ranking_cur= pd.read_csv('../data/raw/wta_rankings_current.csv')

ranking_all = pd.concat([
    ranking_80s,
    ranking_90s,
    ranking_00s,
    ranking_10s,
    ranking_20s,
    ranking_cur
], ignore_index=True)

ranking_all = ranking_all[ranking_all['rank'] <= 100]
ranking_all['ranking_date'] = pd.to_datetime(ranking_all['ranking_date'], format='%Y%m%d', errors='coerce')
ranking_all = ranking_all.dropna(subset=['ranking_date'])
ranking_all.to_csv('../data/proceed/ranking_all.csv', index=False)
