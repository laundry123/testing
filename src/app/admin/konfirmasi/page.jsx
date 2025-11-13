"use client";

import React, { useState, useEffect } from "react";
import NavbarAdmin from "../componenAdmin/navbar";
import SidebarAdmin from "../componenAdmin/sidebar";
import supabase from "@/utils/supabase";

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "white",
    fontFamily: "Poppins, sans-serif",
  },
  sidebarWrapper: {
    width: "250px",
    backgroundColor: "#f4f4f4",
    position: "fixed",
    top: "0",
    bottom: "0",
    paddingTop: "70px",
    zIndex: 100,
  },
  mainContentWrapper: {
    marginLeft: "350px",
    padding: "2rem",
    marginTop: "4rem",
    flexGrow: 1,
  },
  navbarWrapper: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    zIndex: 200,
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  searchBox: {
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchInput: {
    flexGrow: 1,
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
  },
  cardContent: {
    padding: "1rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    fontWeight: "500",
    color: "#000000ff",
    fontSize: "0.9rem",
    marginBottom: "0.3rem",
  },
  cardPrice: {
    color: "#000000ff",
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  statusBadge: (status) => ({
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "4px",
    color: "white",
    backgroundColor: status === "Selesai" ? "#16a34a" : "#f59e0b",
    fontSize: "0.85rem",
    fontWeight: "bold",
    margin: "0.5rem 16px 0 0",
  }),
  button: {
    marginTop: "0.8rem",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#1c8c6c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  waButton: {
    marginTop: "0.5rem",
    padding: "0.4rem 0.5rem",
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};

export default function ProfilAdmin() {
  const [pelangganList, setPelangganList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Ambil data pelanggan dari Supabase
  const ambilPelanggan = async () => {
    const { data: pelanggan, error } = await supabase
      .from("pelanggan")
      .select()
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal memuat data pelanggan:", error.message);
    } else {
      setPelangganList(pelanggan);
    }
  };

  // 🔹 Ubah status ke "Selesai" dan kirim WA otomatis
  const tandaiSelesai = async (pelanggan) => {
    const { id } = pelanggan;
    const { error } = await supabase
      .from("pelanggan")
      .update({ status: "Selesai" })
      .eq("id", id);

    if (error) {
      alert("Gagal mengubah status: " + error.message);
    } else {
      alert("Status berhasil diubah menjadi Selesai!");
      ambilPelanggan();
      kirimWhatsApp({ ...pelanggan, status: "Selesai" });
    }
  };

  // 🔹 Kirim pesan WA dinamis sesuai status + harga per kg
  const kirimWhatsApp = (p) => {
    const statusPesan =
      p.status === "Selesai"
        ? "sudah *SELESAI* ✅. Silakan diambil di tempat kami kapan saja."
        : "sedang *DIPROSES* 🧺 dan akan segera selesai.";

    const pesan = `Halo ${p.namaPelanggan}! 👋

Pesanan laundry Anda ${statusPesan}

📋 *Detail Pesanan:*
• Jenis Layanan: ${p.jenisLayanan}
• Berat Cucian: ${p.berat} kg
• Harga per Kg: Rp ${p.hargaPerKg?.toLocaleString("id-ID") || "-"}
• Total Harga: Rp ${p.totalHarga?.toLocaleString("id-ID")}
• Status: ${p.status || "Proses"}
• Tanggal Terima: ${
      p.tanggalTerima
        ? new Date(p.tanggalTerima).toLocaleDateString("id-ID")
        : "-"
    }
• Tanggal Selesai: ${
      p.tanggalSelesai
        ? new Date(p.tanggalSelesai).toLocaleDateString("id-ID")
        : "-"
    }

Terima kasih sudah menggunakan layanan *Mbak Sprih Laundry*! 🙏`;

    const noWa = p.noHp.replace(/^0/, "62");
    const url = `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  // 🔹 Filter pencarian pelanggan
  const filteredPelanggan = pelangganList.filter((p) =>
    p.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    ambilPelanggan();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.navbarWrapper}>
        <NavbarAdmin />
      </div>

      <div style={{ display: "flex", flexGrow: 1, marginTop: "60px" }}>
        <div style={styles.sidebarWrapper}>
          <SidebarAdmin />
        </div>

        <div style={styles.mainContentWrapper}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Daftar Pesanan Laundry
          </h2>

          {/* 🔍 Pencarian */}
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Cari berdasarkan nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.cardContainer}>
            {filteredPelanggan.length > 0 ? (
              filteredPelanggan.map((p) => (
                <div key={p.id} style={styles.card}>
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{p.namaPelanggan}</h3>
                    <p style={styles.cardDescription}>
                      <strong>Layanan :</strong> {p.jenisLayanan}
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>Berat :</strong> {p.berat} kg
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>Harga per Kg :</strong> Rp{" "}
                      {p.hargaPerKg?.toLocaleString("id-ID") || "-"}
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>Alamat :</strong> {p.alamat}
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>No HP :</strong> {p.noHp}
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>Tanggal Terima :</strong>{" "}
                      {p.tanggalTerima
                        ? new Date(p.tanggalTerima).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                    <p style={styles.cardDescription}>
                      <strong>Tanggal Selesai :</strong>{" "}
                      {p.tanggalSelesai
                        ? new Date(p.tanggalSelesai).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                    <p style={styles.cardPrice}>
                      <strong>Total Harga:</strong> Rp{" "}
                      {p.totalHarga?.toLocaleString("id-ID")}
                    </p>

                    <p style={styles.statusBadge(p.status)}>
                      {p.status || "Proses"}
                    </p>

                    {p.status !== "Selesai" && (
                      <button
                        style={styles.button}
                        onClick={() => tandaiSelesai(p)}
                      >
                        Tandai Selesai
                      </button>
                    )}

                    <button
                      style={styles.waButton}
                      onClick={() => kirimWhatsApp(p)}
                    >
                      Kirim ke WhatsApp 📱
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada data pelanggan ditemukan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
