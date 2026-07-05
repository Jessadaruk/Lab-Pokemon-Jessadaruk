"use client";

import { getIdFromUrl, getPokemonSpriteById, formatPokemonName, type NamedAPIResource } from "@/lib/pokeapi";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export function PokemonCard({ pokemon }: { pokemon: NamedAPIResource }) {
  const id = getIdFromUrl(pokemon.url);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        bgcolor: "rgba(255,255,255,0.92)",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "primary.main",
          boxShadow: "0 18px 38px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardActionArea
        component={NextLink}
        href={`/pokemon/${pokemon.name}`}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ minHeight: 190 }}>
          <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
            <Box
              sx={{
                width: 104,
                height: 104,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "rgba(37,99,235,0.08)",
                border: "1px solid",
                borderColor: "rgba(37,99,235,0.12)",
              }}
            >
              <Box
                component="img"
                src={getPokemonSpriteById(id)}
                alt={pokemon.name}
                sx={{ width: 88, height: 88, objectFit: "contain" }}
              />
            </Box>

            <Stack spacing={0.75} sx={{ alignItems: "center" }}>
              <Chip size="small" label={`#${String(id ?? 0).padStart(4, "0")}`} color="primary" variant="outlined" />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 900, wordBreak: "break-word" }}>
                {formatPokemonName(pokemon.name)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "primary.main" }}>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                รายละเอียด
              </Typography>
              <ArrowForwardIcon fontSize="small" />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
