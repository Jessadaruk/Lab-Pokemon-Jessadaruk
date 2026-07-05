"use client";

import {
  fetchPokemonDetailBundle,
  formatPokemonName,
  formatStatName,
  getEnglishFlavorText,
  getEnglishGenus,
  getPokemonArtwork,
  getPokemonSpriteById,
  type PokemonDetailBundle,
} from "@/lib/pokeapi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { StatBar } from "@/components/StatBar";

function DetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Skeleton variant="rounded" width={140} height={40} animation="wave" />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: 3,
          }}
        >
          <Skeleton variant="rounded" height={430} animation="wave" />
          <Stack spacing={2}>
            <Skeleton variant="text" sx={{ fontSize: "3rem" }} animation="wave" />
            <Skeleton variant="text" width="80%" animation="wave" />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={36} animation="wave" />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default function PokemonDetailPage() {
  const params = useParams<{ name: string }>();
  const pokemonName = useMemo(() => decodeURIComponent(params.name), [params.name]);
  const [detail, setDetail] = useState<PokemonDetailBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPokemonDetail() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonDetailBundle(pokemonName, controller.signal);
        setDetail(data);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError("ไม่สามารถดึงรายละเอียด Pokemon ได้");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPokemonDetail();

    return () => controller.abort();
  }, [pokemonName]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={2}>
          <Button component={NextLink} href="/" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
            กลับหน้าแรก
          </Button>
          <Alert severity="error">{error ?? "ไม่พบข้อมูล Pokemon"}</Alert>
        </Stack>
      </Container>
    );
  }

  const { pokemon, species, evolutionStages } = detail;
  const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy || "";
  const flavorText = getEnglishFlavorText(species);
  const genus = getEnglishGenus(species);

  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Button component={NextLink} href="/" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
            กลับหน้าแรก
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 5 },
                display: "grid",
                placeItems: "center",
                minHeight: { xs: 320, md: 500 },
                bgcolor: "rgba(255,255,255,0.78)",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={getPokemonArtwork(pokemon)}
                alt={pokemon.name}
                sx={{
                  width: "min(100%, 380px)",
                  aspectRatio: "1",
                  objectFit: "contain",
                  filter: "drop-shadow(0 24px 36px rgba(15,23,42,0.18))",
                }}
              />
            </Paper>

            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  <Chip color="primary" label={`#${String(pokemon.id).padStart(4, "0")}`} />
                  {genus ? <Chip color="success" variant="outlined" label={genus} /> : null}
                </Stack>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: 42, md: 64 },
                    lineHeight: 1,
                  }}
                >
                  {formatPokemonName(pokemon.name)}
                </Typography>
                {flavorText ? (
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                    {flavorText}
                  </Typography>
                ) : null}
              </Stack>

              <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    ประเภทของโปเกม่อน
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    {pokemon.types.map((item) => (
                      <Chip key={item.type.name} label={formatPokemonName(item.type.name)} color="secondary" />
                    ))}
                  </Stack>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    สถานะ
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                      gap: 2,
                    }}
                  >
                    <Chip variant="outlined" label={`Height ${(pokemon.height / 10).toFixed(1)} m`} />
                    <Chip variant="outlined" label={`Weight ${(pokemon.weight / 10).toFixed(1)} kg`} />
                    <Chip variant="outlined" label={`Base EXP ${pokemon.base_experience ?? "-"}`} />
                    <Chip variant="outlined" label={`${pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)} Total Stats`} />
                  </Box>
                  <Divider />
                  <Stack spacing={1.5}>
                    {pokemon.stats.map((stat) => (
                      <StatBar
                        key={stat.stat.name}
                        label={formatStatName(stat.stat.name)}
                        value={stat.base_stat}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Box>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2.5}>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                วิวัฒนาการ
              </Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ alignItems: { xs: "stretch", md: "center" } }}
              >
                {evolutionStages.map((stage, stageIndex) => (
                  <Stack
                    key={`stage-${stageIndex}`}
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ flex: 1, alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: 1.5,
                        width: "100%",
                      }}
                    >
                      {stage.map((evolution) => (
                        <Paper
                          key={evolution.name}
                          variant="outlined"
                          sx={{ p: 1.5, textAlign: "center", bgcolor: "rgba(37,99,235,0.04)" }}
                        >
                          <Stack spacing={1} sx={{ alignItems: "center" }}>
                            <Box
                              component="img"
                              src={getPokemonSpriteById(evolution.id)}
                              alt={evolution.name}
                              sx={{ width: 72, height: 72, objectFit: "contain" }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 900 }}>
                              {formatPokemonName(evolution.name)}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                    {stageIndex < evolutionStages.length - 1 ? (
                      <ArrowForwardIcon
                        color="primary"
                        sx={{
                          flexShrink: 0,
                          transform: { xs: "rotate(90deg)", md: "none" },
                        }}
                      />
                    ) : null}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <VolumeUpIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  เสียงของโปเกม่อน
                </Typography>
              </Stack>
              {cryUrl ? (
                <Box
                  component="audio"
                  controls
                  src={cryUrl}
                  sx={{ width: "100%", maxWidth: 520 }}
                />
              ) : (
                <Alert severity="info">Pokemon ตัวนี้ยังไม่มีไฟล์เสียงใน PokeAPI</Alert>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
