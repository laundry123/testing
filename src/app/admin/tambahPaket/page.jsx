"use client";

import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import NavbarAdmin from "../componenAdmin/navbar";
import SidebarAdmin from "../componenAdmin/sidebar";

export default function FormTambahPelanggan() {
  const [formData, setFormData] = useState({
    id: null,
    namaPelanggan: "",
    noHp: "",
    alamat: "",
    jenisLayanan: "",
    berat: "",
    hargaPerKg: "",
    totalHarga: "",
    status: "Proses",
    tanggalTerima: "",
    tanggalSelesai: "",
  });

  const [pelangganList, setPelangganList] = useState([]);
  const [paketList, setPaketList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Ambil data pelanggan
  const ambilPelanggan = async () => {
    const { data, error } = await supabase
      .from("pelanggan")
      .select()
      .order("id", { ascending: true });
    if (error) console.error("Gagal memuat data pelanggan:", error.message);
    else setPelangganList(data);
  };

  // 🔹 Ambil data paket layanan
  const ambilPaket = async () => {
    const { data, error } = await supabase
      .from("paketLaundri")
      .select("id, nama, harga");
    if (error) console.error("Gagal memuat data paket:", error.message);
    else setPaketList(data);
  };

  useEffect(() => {
    ambilPelanggan();
    ambilPaket();
  }, []);

  // 🔹 Hitung total harga otomatis & ambil harga per kg dari layanan
  useEffect(() => {
    const selectedPaket = paketList.find(
      (p) => p.nama === formData.jenisLayanan
    );
    if (selectedPaket) {
      const harga = selectedPaket.harga;
      const total = parseFloat(formData.berat || 0) * harga;
      setFormData((prev) => ({
        ...prev,
        hargaPerKg: harga,
        totalHarga: total,
      }));
    }
  }, [formData.jenisLayanan, formData.berat, paketList]);

  // 🔹 Handle input perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit data pelanggan (tambah / edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, ...pelangganData } = formData;

    const dataBersih = Object.fromEntries(
      Object.entries(pelangganData).map(([key, val]) => [key, val ?? ""])
    );

    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("pelanggan")
          .update(dataBersih)
          .eq("id", id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("pelanggan")
          .insert([dataBersih]);
        error = insertError;
      }

      if (error) {
        console.error("❌ Error:", error.message);
        alert("Gagal menyimpan data: " + error.message);
      } else {
        await ambilPelanggan();
        resetForm();
        setIsEditing(false);
        alert(
          isEditing
            ? "✅ Data berhasil diperbarui!"
            : "✅ Data berhasil ditambahkan!"
        );
      }
    } catch (err) {
      console.error("Kesalahan saat submit:", err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      namaPelanggan: "",
      noHp: "",
      alamat: "",
      jenisLayanan: "",
      berat: "",
      hargaPerKg: "",
      totalHarga: "",
      status: "Proses",
      tanggalTerima: "",
      tanggalSelesai: "",
    });
  };

  const handleEdit = (pelanggan) => {
    setFormData({
      id: pelanggan.id,
      namaPelanggan: pelanggan.namaPelanggan,
      noHp: pelanggan.noHp,
      alamat: pelanggan.alamat,
      jenisLayanan: pelanggan.jenisLayanan,
      berat: pelanggan.berat,
      hargaPerKg: pelanggan.hargaPerKg,
      totalHarga: pelanggan.totalHarga,
      status: pelanggan.status,
      tanggalTerima: pelanggan.tanggalTerima,
      tanggalSelesai: pelanggan.tanggalSelesai,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) {
      const { error } = await supabase.from("pelanggan").delete().eq("id", id);
      if (error) console.error("Gagal menghapus pelanggan:", error.message);
      else ambilPelanggan();
    }
  };

  // 🔹 Tandai selesai + kirim WA
  const handleSelesai = async (pelanggan) => {
    const { id, noHp, namaPelanggan, jenisLayanan, totalHarga, hargaPerKg } =
      pelanggan;

    const { error } = await supabase
      .from("pelanggan")
      .update({ status: "Selesai" })
      .eq("id", id);

    if (error) {
      console.error("Gagal memperbarui status:", error.message);
      return;
    }

    await ambilPelanggan();

    try {
      const pesan = `Halo ${namaPelanggan} 👋

Pesanan laundry Anda sudah *SELESAI* ✅
📋 Detail:
• Layanan: ${jenisLayanan}
• Harga per Kg: Rp ${hargaPerKg?.toLocaleString("id-ID")}
• Total: Rp ${totalHarga?.toLocaleString("id-ID")}

Terima kasih telah menggunakan layanan *Mbak Sprih Laundry*! 🙏`;

      const nomorWa = noHp.replace(/^0/, "62");
      const url = `https://wa.me/${nomorWa}?text=${encodeURIComponent(pesan)}`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Gagal membuka WhatsApp:", err);
    }
  };

  // 🔹 Filter pelanggan berdasarkan pencarian nama
  const filteredPelanggan = pelangganList.filter((p) =>
    p.namaPelanggan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------- LAYOUT --------------------
  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      <SidebarAdmin />
      <div className="flex-1 ml-72">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarAdmin />
        </div>

        <main className="mt-20 px-8">
          {/* Form Tambah/Edit Pelanggan */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 rounded-lg shadow-lg bg-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEditing ? "Edit Data Pelanggan" : "Tambah Pelanggan"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Nama Pelanggan"
                  name="namaPelanggan"
                  value={formData.namaPelanggan}
                  onChange={handleChange}
                />
                <InputField
                  label="Nomor HP"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  type="number"
                />
                <TextareaField
                  label="Alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                />
                <SelectField
                  label="Jenis Layanan"
                  name="jenisLayanan"
                  value={formData.jenisLayanan}
                  onChange={handleChange}
                  options={paketList.map((p) => p.nama)}
                />
                <InputField
                  label="Berat Cucian (Kg)"
                  name="berat"
                  type="number"
                  value={formData.berat}
                  onChange={handleChange}
                />
                <InputField
                  label="Harga per Kg (Rp)"
                  name="hargaPerKg"
                  type="number"
                  value={formData.hargaPerKg}
                  readOnly
                />
                <InputField
                  label="Total Harga (Rp)"
                  name="totalHarga"
                  type="number"
                  value={formData.totalHarga}
                  readOnly
                />
                <InputField
                  label="Tanggal Terima"
                  name="tanggalTerima"
                  type="date"
                  value={formData.tanggalTerima}
                  onChange={handleChange}
                />
                <InputField
                  label="Tanggal Selesai"
                  name="tanggalSelesai"
                  type="date"
                  value={formData.tanggalSelesai}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                {isEditing ? "Update Data" : "Tambah Pelanggan"}
              </button>
            </form>
          </div>

          {/* 🔍 Pencarian */}
          <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Pelanggan
            </h2>
            <input
              type="text"
              placeholder="Cari nama pelanggan..."
              className="border px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Daftar Pelanggan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {filteredPelanggan.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Tidak ada pelanggan ditemukan.
              </p>
            ) : (
              <ul className="space-y-4">
                {filteredPelanggan.map((pelanggan) => (
                  <li
                    key={pelanggan.id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {pelanggan.namaPelanggan}
                      </p>
                      <p className="text-sm text-gray-600">
                        HP: {pelanggan.noHp}
                      </p>
                      <p className="text-sm text-gray-600">
                        Layanan: {pelanggan.jenisLayanan}
                      </p>
                      <p className="text-sm text-gray-600">
                        Harga per Kg: Rp{" "}
                        {pelanggan.hargaPerKg?.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Berat: {pelanggan.berat} Kg
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: Rp{" "}
                        {pelanggan.totalHarga?.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Terima: {pelanggan.tanggalTerima || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Selesai: {pelanggan.tanggalSelesai || "-"}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          pelanggan.status === "Selesai"
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        Status: {pelanggan.status || "Proses"}
                      </p>
                    </div>

                    <div className="space-x-2">
                      {pelanggan.status !== "Selesai" && (
                        <button
                          onClick={() => handleSelesai(pelanggan)}
                          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                        >
                          Tandai Selesai
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(pelanggan)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pelanggan.id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// -------------------- KOMPONEN INPUT --------------------
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full p-3 border rounded-lg ${
          readOnly ? "bg-gray-200" : "bg-white"
        } text-gray-700`}
        required={!readOnly}
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full p-3 border rounded-lg bg-white text-gray-700"
        required
      ></textarea>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full p-3 border rounded-lg bg-white text-gray-700"
        required
      >
        <option value="">-- Pilih Layanan --</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
