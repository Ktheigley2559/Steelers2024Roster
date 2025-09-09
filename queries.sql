SELECT player_name, position,
      CAST(jersey_number AS INTEGER) AS jersey_number,
      CAST(week AS INTEGER) AS week,
      headshot_url,
      CASE
          WHEN position = 'QB' THEN 'Offense'
          WHEN position = 'RB' THEN 'Offense'
          WHEN position = 'FB' THEN 'Offense'
          WHEN position = 'WR' THEN 'Offense'
          WHEN position = 'TE' THEN 'Offense'
          WHEN position = 'C' THEN 'Offense'
          WHEN position = 'OL' THEN 'Offense'
          WHEN position = 'OT' THEN 'Offense'
          WHEN position = 'OG' THEN 'Offense'
          WHEN position = 'G' THEN 'Offense'
          WHEN position = 'T' THEN 'Offense'
          WHEN position = 'DT' THEN 'Defense'
          WHEN position = 'NT' THEN 'Defense'
          WHEN position = 'DL' THEN 'Defense'
          WHEN position = 'LB' THEN 'Defense'
          WHEN position = 'ILB' THEN 'Defense'
          WHEN position = 'OLB' THEN 'Defense'
          WHEN position = 'MLB' THEN 'Defense'
          WHEN position = 'CB' THEN 'Defense'
          WHEN position = 'S' THEN 'Defense'
          WHEN position = 'FS' THEN 'Defense'
          WHEN position = 'SS' THEN 'Defense'
          WHEN position = 'DB' THEN 'Defense'
          WHEN position = 'K' THEN 'Special Teams'
          WHEN position = 'P' THEN 'Special Teams'
          WHEN position = 'LS' THEN 'Special Teams'
          ELSE 'Other'
      END AS unit
FROM roster;