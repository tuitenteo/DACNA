import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Autocomplete,
    Checkbox
} from "@mui/material";

const BaoGia = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]); // Thêm state này

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/vattu", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaterials(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vật tư:", error);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (selectedMaterials.length === 0) {
        setSuppliers([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const supplierLists = await Promise.all(
          selectedMaterials.map(async (idvattu) => {
            const res = await axios.get(
              `http://localhost:5000/api/nhacungcap/vattu/${idvattu}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
          })
        );
        // Lấy hợp các nhà cung cấp (không trùng lặp)
        const allSuppliers = supplierLists.flat();
        const uniqueSuppliers = [];
        const seen = new Set();
        for (const sup of allSuppliers) {
          if (!seen.has(sup.idncc)) {
            uniqueSuppliers.push(sup);
            seen.add(sup.idncc);
          }
        }
        setSuppliers(uniqueSuppliers);
        setSelectedSuppliers(uniqueSuppliers.map((s) => s.idncc)); // Mặc định chọn hết
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
        setSuppliers([]);
        setSelectedSuppliers([]);
      }
    };
    fetchSuppliers();
  }, [selectedMaterials]);

  // Hàm chọn/bỏ chọn nhà cung cấp
  const handleSupplierCheck = (idncc) => {
    setSelectedSuppliers((prev) =>
      prev.includes(idncc)
        ? prev.filter((id) => id !== idncc)
        : [...prev, idncc]
    );
  };

  // Hàm gửi email yêu cầu báo giá
  const handleSendEmail = async () => {
    if (selectedMaterials.length === 0 || selectedSuppliers.length === 0) {
      alert("Vui lòng chọn vật tư và chọn ít nhất một nhà cung cấp.");
      return;
    }
    const selectedMaterialDetails = materials.filter((m) =>
      selectedMaterials.includes(m.idvattu)
    );
    const materialList = selectedMaterialDetails
      .map((m) => `- ${m.tenvattu}`)
      .join("\n");

    const emailContent = `
Kính gửi Quý Nhà Cung Cấp,

Chúng tôi muốn yêu cầu báo giá cho các vật tư sau:
${materialList}

Trân trọng,
Công ty KKTL
        `;

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        suppliers
          .filter((supplier) => selectedSuppliers.includes(supplier.idncc))
          .map((supplier) =>
            axios.post(
              "http://localhost:5000/api/send-email",
              {
                email: supplier.email,
                subject: "Yêu cầu báo giá vật tư",
                message: emailContent,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          )
      );
      alert("Email đã được gửi đến các nhà cung cấp đã chọn.");
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      alert("Không thể gửi email.");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <h1>Báo Giá</h1>

      <Autocomplete
        multiple
        options={materials}
        disableCloseOnSelect
        getOptionLabel={(option) => `${option.idvattu} - ${option.tenvattu}`}
        value={materials.filter((m) => selectedMaterials.includes(m.idvattu))}
        onChange={(event, newValue) => {
          setSelectedMaterials(newValue.map((item) => item.idvattu));
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props; // Loại bỏ key khỏi props
          return (
            <li key={option.idvattu} {...rest}>
              <Checkbox
                checked={selectedMaterials.includes(option.idvattu)}
                style={{ marginRight: 8 }}
              />
              {option.idvattu} - {option.tenvattu}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tìm kiếm và chọn vật tư"
            placeholder="Nhập tên hoặc mã vật tư"
          />
        )}
        sx={{ width: "100%" }}
      />

      {/* Danh sách nhà cung cấp */}
      <Box sx={{ marginBottom: "20px", marginTop: "30px" }}>
        <h3>Nhà Cung Cấp Hỗ Trợ Các Vật Tư Đã Chọn</h3>
        {suppliers.length === 0 ? (
          <p>Không có nhà cung cấp nào phù hợp.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lựa Chọn</TableCell>
                <TableCell>Tên Nhà Cung Cấp</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Địa Chỉ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.idncc}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSuppliers.includes(supplier.idncc)}
                      onChange={() => handleSupplierCheck(supplier.idncc)}
                    />
                  </TableCell>
                  <TableCell>{supplier.tenncc}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.sodienthoai}</TableCell>
                  <TableCell>{supplier.diachi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Gửi email */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          disabled={
            selectedMaterials.length === 0 || selectedSuppliers.length === 0
          }
          onClick={handleSendEmail}
        >
          Gửi Yêu Cầu Báo Giá
        </Button>
      </Box>
    </Box>
  );
};

export default BaoGia;