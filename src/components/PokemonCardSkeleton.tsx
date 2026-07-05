"use client";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export function PokemonCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Skeleton variant="circular" width={92} height={92} animation="wave" />
          <Skeleton variant="text" width="68%" sx={{ fontSize: "1.35rem" }} animation="wave" />
          <Skeleton variant="rounded" width="46%" height={26} animation="wave" />
        </Stack>
      </CardContent>
    </Card>
  );
}
