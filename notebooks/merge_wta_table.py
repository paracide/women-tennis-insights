import pandas as pd

# 读取两个 CSV 文件
df1 = pd.read_csv('../data/proceed/merged_wta_before_2007.csv')
df2 = pd.read_csv('../data/proceed/merged_wta_after_2007.csv')

# 为第一个 DataFrame 添加从 1 开始的自增 ID
df1.insert(0, 'id', range(1, len(df1) + 1))

# 为第二个 DataFrame 添加连续的 ID（从 df1 最后的 ID + 1 开始）
start_id = df1['id'].iloc[-1] + 1
df2.insert(0, 'id', range(start_id, start_id + len(df2)))

# 转换 draw_size 为 int，防止 '13.0' 等字符串出错
df1['draw_size'] = pd.to_numeric(df1['draw_size'], errors='coerce').fillna(0).astype(int)
df2['draw_size'] = pd.to_numeric(df2['draw_size'], errors='coerce').fillna(0).astype(int)

# 分别导出为新的 CSV 文件
df1.to_csv('../data/proceed/wta_before_2007_with_id.csv', index=False)
df2.to_csv('../data/proceed/wta_after_2007_with_id.csv', index=False)
