  
  // Hàm định dạng ngày thành dd/mm/yyyy
  export const formatDateToDDMMYYYY = (date) => {
    if (!date) return "Không xác định";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };