"use client";

import { PokemonCard } from "@/components/PokemonCard";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import { fetchPokemonPage, type PokemonListResponse } from "@/lib/pokeapi";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 36;

export default function Home() {
  const [page, setPage] = useState(1);
  const [pokemonPage, setPokemonPage] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPokemonPage() {
      try {
        setLoading(true);
        setError(null);
        const offset = (page - 1) * PAGE_SIZE;
        const data = await fetchPokemonPage(PAGE_SIZE, offset, controller.signal);
        setPokemonPage(data);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError("ไม่สามารถดึงข้อมูล Pokemon ได้ในขณะนี้");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPokemonPage();

    return () => controller.abort();
  }, [page]);

  const totalCount = pokemonPage?.count ?? 1351;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const range = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, totalCount);
    return { start, end };
  }, [page, totalCount]);

  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={1}>
              <Chip label="PokeAPI / Pokemon" color="secondary" sx={{ width: "fit-content" }} />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 36, md: 56 },
                  lineHeight: 1,
                }}
              >
                Pokemon ทั้ง 1351 ตัว
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                แสดงข้อมูลแบบแบ่งหน้า ครั้งละ {PAGE_SIZE} ตัวจาก PokeAPI เพื่อลดขนาดข้อมูลที่ต้องโหลดในแต่ละครั้ง
              </Typography>
            </Stack>

            <Stack spacing={1} sx={{ alignItems: { xs: "flex-start", md: "flex-end" } }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                หน้า {page} / {totalPages}
              </Typography>
              <Chip
                color="primary"
                label={`ลำดับ ${range.start.toLocaleString()}-${range.end.toLocaleString()} จาก ${totalCount.toLocaleString()}`}
              />
            </Stack>
          </Stack>

          {error ? (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => setPage((currentPage) => currentPage)}
                >
                  โหลดใหม่
                </Button>
              }
            >
              {error}
            </Alert>
          ) : null}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <PokemonCardSkeleton key={`pokemon-skeleton-${index}`} />
                ))
              : pokemonPage?.results.map((pokemon) => (
                  <PokemonCard key={pokemon.name} pokemon={pokemon} />
                ))}
          </Box>

          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              onChange={(_, nextPage) => {
                setPage(nextPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
