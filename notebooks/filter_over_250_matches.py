import pandas as pd

# 读取两个 CSV 文件
df1 = pd.read_csv('../data/proceed/merged_wta_before_2007.csv')
df2 = pd.read_csv('../data/proceed/merged_wta_after_2007.csv')

# 合并数据
df = pd.concat([df1, df2], ignore_index=True)

# 只保留 tourney_level 在列表中的行（排除 I 类）
high_level_df = df[df['tourney_level'].isin(['G', 'PM', 'P', 'P5', 'W'])]

# 为第一个 DataFrame 添加从 1 开始的自增 ID
high_level_df.insert(0, 'id', range(1, len(high_level_df) + 1))

high_level_df['draw_size'] = pd.to_numeric(high_level_df['draw_size'], errors='coerce').fillna(0).astype(int)

# 分别导出为新的 CSV 文件
high_level_df.to_csv('../data/proceed/wta_250_plus.csv', index=False)



