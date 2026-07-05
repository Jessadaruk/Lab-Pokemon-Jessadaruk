"use client";

import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export function StatBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const percent = Math.min(100, Math.round((value / 180) * 100));

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 0.75, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 900 }}>
          {value}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 10,
          borderRadius: 8,
          bgcolor: "rgba(21,32,43,0.08)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 8,
            background: "linear-gradient(90deg, #0f9f6e, #2563eb)",
          },
        }}
      />
    </Box>
  );
}
