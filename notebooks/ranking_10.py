import json
from supabase import create_client, Client

# 配置 Supabase
SUPABASE_URL = "https://haspwvnpcsazhfxacpcg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc3B3dm5wY3NhemhmeGFjcGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTQ4MzcsImV4cCI6MjA2ODg5MDgzN30.iuquK3OEQqnWxrjgZJyVMlkuV084GDbyWL70JyI6CM4"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 查询所有排名数据
rankings = supabase.table("ranking_100").select("*").gt('ranking_date',"2000-01-01").execute().data
players = supabase.table("player").select("player_id, name_first, name_last").execute().data

# 将 player_id 映射到全名
player_map = {p["player_id"]: f"{p['name_first']} {p['name_last']}".strip() for p in players}

# 构造 ranking_date -> { name: points } 结构
from collections import defaultdict

date_map = defaultdict(list)
for r in rankings:
    date = r["ranking_date"]
    rank = r["rank"]
    player_id = r["player"]
    points = r["points"]
    if rank <= 10:
        name = player_map.get(player_id, f"Unknown {player_id}")
        date_map[date].append((rank, name, points))

# 排序并格式化输出
result = {}
for date in sorted(date_map.keys()):
    top10 = sorted(date_map[date], key=lambda x: x[0])  # 按排名升序
    result[date] = {name: points for _, name, points in top10}

# 写入 JSON 文件
with open("data.json", "w") as f:
    json.dump(result, f, indent=2)

