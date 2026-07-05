"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import SchoolIcon from "@mui/icons-material/School";
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";

const developerInfo = [
  ["ผู้พัฒนา", "นายเจษฎารักษ์ วิชาไชย"],
  ["รหัสนักศึกษา", "673450207-3"],
  ["รายวิชา", "Front-end Web Programming"],
  ["คณะ", "คณะสหวิทยาการ"],
  ["สาขา", "วิทยาการคอมพิวเตอร์"],
  ["มหาวิทยาลัย", "มหาวิทยาลัยขอนแก่น"],
];

export default function AboutPage() {
  return (
    <Box component="main">
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Chip icon={<SchoolIcon />} label="About This Project" color="primary" sx={{ width: "fit-content" }} />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 36, md: 54 },
                lineHeight: 1.05,
              }}
            >
              Pokemon Explorer
            </Typography>
            <Typography color="text.secondary">
              โปรเจกต์เว็บไซต์ React / Next.js สำหรับแสดงข้อมูล Pokemon จาก PokeAPI พร้อมหน้าแสดงรายละเอียดแต่ละตัว
            </Typography>
          </Stack>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                ข้อมูลผู้พัฒนา
              </Typography>
              <Divider />
              <Stack spacing={1.5}>
                {developerInfo.map(([label, value]) => (
                  <Stack
                    key={label}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={0.75}
                    sx={{
                      py: 1,
                      justifyContent: "space-between",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderBottom: 0 },
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontWeight: 900 }}>{value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3 },
              bgcolor: "rgba(15,159,110,0.06)",
              borderColor: "rgba(15,159,110,0.22)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "stretch", sm: "center" } }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  GitHub Source Code
                </Typography>
                <Typography color="text.secondary">
                  เปิดดู source code ของโปรเจคนี้บน GitHub
                </Typography>
              </Box>
              <Button
                component="a"
                href="https://github.com/Jessadaruk/Lab-Pokemon-Jessadaruk/tree/main"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<GitHubIcon />}
              >
                GitHub
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
