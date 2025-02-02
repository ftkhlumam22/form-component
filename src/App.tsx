import { useState } from "react";
import DynamicForm from "./components/DynamicsForm";
import {
  FaUser,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaKey,
  FaEye,
  FaSave,
} from "react-icons/fa";
import { useFormContext } from "react-hook-form";

const mockApiResponse = {
  namaPenjual: "John Doe",
  namaToko: "tokoexample",
  emailToko: "john@example.com",
  phone: "081234567890",
  pekerjaan: "programmer",
  rating: 4,
  agreement: true,
  gender: "male",
  status: "married",
  volume: 75,
  alamat: "Jl. Contoh No. 123\nKota Contoh",
  info: "INFO-12345",
  secretCode: "SECRET-CODE-123",
  priorities: [
    { id: "97yibgyu6t7gi", content: "Pembayaran" },
    { id: "iuhubuh80hji", content: "Pengiriman" },
    { id: "csrzftguhh97y7", content: "Customer Service" },
  ],
};

const CustomButtons = ({ setIsDetail }: any) => {
  const { formState } = useFormContext();

  console.log(formState);
  return (
    <div className="mt-6 flex gap-4">
      <button
        type="button"
        onClick={() => setIsDetail((prev: boolean) => !prev)}
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
      >
        <FaEye className="mr-2" />
        Preview
      </button>

      <button
        type="submit"
        disabled={!formState.isDirty || !formState.isValid} // Tambahkan validasi isDirty
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaSave className="mr-2" />
        {formState.isSubmitting ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
};

function App() {
  const [showSecretIcon, setShowSecretIcon] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [agreement, setAgreement] = useState(false);

  const penjualanFormData: any = [
    [
      {
        label: "Nama Penjual",
        formName: "namaPenjual",
        column: "1",
        type: "string",
        icon: FaUser,
        iconPosition: "left",
        validation: { required: "Nama penjual wajib diisi" },
        validationMessage: { required: "Field ini wajib diisi" },
      },
    ],
    [
      {
        label: "Nama Toko",
        formName: "namaToko",
        column: "1/2",
        type: "string",
        icon: FaStore,
        iconPosition: "right",
        validation: {
          pattern: /^[a-z]+$/,
          maxLength: 25,
        },
        validationMessage: {
          pattern: "Hanya huruf kecil tanpa spasi",
          maxLength: "Maksimal 25 karakter",
        },
      },
      {
        label: "Email Toko",
        formName: "emailToko",
        column: "1/2",
        type: "email",
        icon: FaEnvelope,
        iconPosition: "right",
        validation: {
          maxLength: 50,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        validationMessage: {
          maxLength: "Maksimal 50 karakter",
          pattern: "Format email tidak valid",
        },
      },
    ],
    [
      {
        label: "Telepon",
        formName: "phone",
        column: "1/3",
        type: "number",
        icon: FaPhone,
        iconPosition: "right",
        validation: {
          maxLength: 13,
          validate: (value: string) => value.replace(/-/g, "").length === 12,
        },
        validationMessage: {
          maxLength: "Maksimal 13 digit",
          validate: "Nomor telepon harus 12 digit",
        },
      },
      {
        label: "Pekerjaan",
        formName: "pekerjaan",
        column: "1/3",
        type: "selection",
        option: [
          { label: "Programmer", value: "programmer" },
          { label: "Desainer", value: "designer" },
          { label: "Marketing", value: "marketing" },
        ],
        validation: { required: true },
        validationMessage: { required: "Pilih pekerjaan" },
      },
      {
        label: "Rating",
        formName: "rating",
        column: "1/3",
        type: "number",
        validation: {
          min: 1,
          max: 5,
        },
        validationMessage: {
          min: "Minimum rating 1",
          max: "Maksimum rating 5",
        },
      },
    ],
    [
      {
        label: "Setuju dengan Syarat & Ketentuan",
        formName: "agreement",
        column: "1",
        type: "checkbox",
        validation: { required: true },
        validationMessage: { required: "Anda harus menyetujui syarat" },
      },
    ],
    ...(agreement
      ? [
          [
            {
              label: "Jenis Kelamin",
              formName: "gender",
              column: "1/2",
              type: "radio",
              option: [
                { label: "Laki-laki", value: "male" },
                { label: "Perempuan", value: "female" },
                { label: "Lainnya", value: "other" },
              ],
              validation: { required: true },
              validationMessage: { required: "Pilih jenis kelamin" },
            },
            {
              label: "Status",
              formName: "status",
              column: "1/2",
              type: "radio",
              option: [
                { label: "Menikah", value: "married" },
                { label: "Belum Menikah", value: "single" },
              ],
            },
          ],
        ]
      : []),
    [
      {
        label: "Volume Suara",
        formName: "volume",
        column: "1",
        type: "slider",
        min: 0,
        max: 100,
        step: 5,
        validation: { min: 10 },
        validationMessage: { min: "Minimum volume 10" },
      },
    ],
    [
      {
        label: "Alamat Lengkap",
        formName: "alamat",
        column: "1",
        type: "custom",
        render: ({ onChange, onBlur, value, ref }) => (
          <textarea
            disabled={false}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            className="w-full rounded-lg border p-2"
            rows={4}
            placeholder="Masukkan alamat lengkap..."
          />
        ),
        validation: { required: true, maxLength: 200 },
        validationMessage: {
          required: "Alamat wajib diisi",
          maxLength: "Maksimal 200 karakter",
        },
      },
    ],
    [
      {
        label: "Informasi Tambahan",
        formName: "info",
        column: "1",
        type: "string",
        validation: {
          validate: (value: string) =>
            value?.startsWith("INFO-") || "Harus diawali INFO-",
        },
        validationMessage: {
          validate: "Input harus diawali dengan INFO-",
        },
      },
    ],
    [
      {
        label: "Kode Rahasia",
        formName: "secretCode",
        type: "string",
        icon: FaKey,
        column: "1",
        showIcon: showSecretIcon,
        iconPosition: "right",
        iconOnClick: () => setShowSecretIcon(false),
        validation: { required: true },
      },
    ],
    [
      {
        label: "Urutan Prioritas",
        formName: "priorities",
        type: "dnd",
        column: "1",
        validation: {
          validate: (value: any) => value.length >= 3 || "Minimal 3 item",
        },
        validationMessage: {
          validate: "Harus ada minimal 3 prioritas",
        },
      },
    ],
    [
      {
        formName: "newPriority",
        type: "custom",
        column: "1",
        render: ({ onChange, value }) => {
          const { setValue, getValues } = useFormContext();

          return (
            <div className="flex gap-2">
              <input
                value={value || ""}
                onChange={onChange}
                className="flex-1 rounded border p-2"
                placeholder="Tambah prioritas baru"
              />
              <button
                type="button"
                onClick={() => {
                  if (!value) return;
                  const newItem = {
                    id: `item-${Math.random().toString(36).substr(2, 9)}`, // ID lebih unik
                    content: value,
                  };
                  const currentPriorities = getValues("priorities") || [];
                  setValue("priorities", [...currentPriorities, newItem]);
                  onChange(""); // Reset input
                }}
                className="rounded bg-blue-500 px-4 py-2 text-white"
              >
                Tambah
              </button>
            </div>
          );
        },
      },
    ],
  ];

  const detailPenjualanFormData: any = [
    [
      {
        label: "Nama Penjual",
        formName: "namaPenjual",
        column: "1/2",
        type: "string",
        icon: FaUser,
        iconPosition: "left",
        validation: { required: "Nama penjual wajib diisi" },
        validationMessage: { required: "Field ini wajib diisi" },
      },
      {
        label: "Nama Toko",
        formName: "namaToko",
        column: "1/2",
        type: "string",
        icon: FaStore,
        iconPosition: "right",
        validation: {
          pattern: /^[a-z]+$/,
          maxLength: 25,
        },
        validationMessage: {
          pattern: "Hanya huruf kecil tanpa spasi",
          maxLength: "Maksimal 25 karakter",
        },
      },
    ],
    [
      {
        label: "Email Toko",
        formName: "emailToko",
        column: "1/2",
        type: "email",
        icon: FaEnvelope,
        iconPosition: "right",
        validation: {
          maxLength: 50,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        validationMessage: {
          maxLength: "Maksimal 50 karakter",
          pattern: "Format email tidak valid",
        },
      },
      {
        label: "Telepon",
        formName: "phone",
        column: "1/2",
        type: "number",
        icon: FaPhone,
        iconPosition: "right",
        validation: {
          maxLength: 13,
          validate: (value: string) => value.replace(/-/g, "").length === 12,
        },
        validationMessage: {
          maxLength: "Maksimal 13 digit",
          validate: "Nomor telepon harus 12 digit",
        },
      },
    ],
    [
      {
        label: "Pekerjaan",
        formName: "pekerjaan",
        column: "1/2",
        type: "selection",
        option: [
          { label: "Programmer", value: "programmer" },
          { label: "Desainer", value: "designer" },
          { label: "Marketing", value: "marketing" },
        ],
        validation: { required: true },
        validationMessage: { required: "Pilih pekerjaan" },
      },
      {
        label: "Rating",
        formName: "rating",
        column: "1/3",
        type: "number",
        validation: {
          min: 1,
          max: 5,
        },
        validationMessage: {
          min: "Minimum rating 1",
          max: "Maksimum rating 5",
        },
      },
    ],
    [
      {
        label: "Setuju dengan Syarat & Ketentuan",
        formName: "agreement",
        column: "1/5",
        type: "checkbox",
        customValue: (val: any) => (
          <div className="flex items-center gap-2">
            <p className="text-lg text-yellow-300">Saya setuju</p>
          </div>
        ),
        validation: { required: true },
        validationMessage: { required: "Anda harus menyetujui syarat" },
      },
      {
        label: "Jenis Kelamin",
        formName: "gender",
        column: "1/5",
        type: "radio",
        option: [
          { label: "Laki-laki", value: "male" },
          { label: "Perempuan", value: "female" },
          { label: "Lainnya", value: "other" },
        ],
        validation: { required: true },
        validationMessage: { required: "Pilih jenis kelamin" },
      },
      {
        label: "Status",
        formName: "status",
        column: "1/5",
        type: "radio",
        option: [
          { label: "Menikah", value: "married" },
          { label: "Belum Menikah", value: "single" },
        ],
      },
      {
        label: "Volume Suara",
        formName: "volume",
        column: "1/5",
        type: "string",
        min: 0,
        max: 100,
        step: 5,
        validation: { min: 10 },
        validationMessage: { min: "Minimum volume 10" },
      },
      {
        label: "Informasi Tambahan",
        formName: "info",
        column: "1/5",
        type: "string",
        validation: {
          validate: (value: string) =>
            value?.startsWith("INFO-") || "Harus diawali INFO-",
        },
        validationMessage: {
          validate: "Input harus diawali dengan INFO-",
        },
      },
    ],
    [
      {
        label: "Alamat Lengkap",
        formName: "alamat",
        column: "1/2",
        type: "custom",
        render: ({ onChange, onBlur, value, ref }) => (
          <textarea
            disabled={false}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            className="w-full rounded-lg border p-2"
            rows={4}
            placeholder="Masukkan alamat lengkap..."
          />
        ),
        validation: { required: true, maxLength: 200 },
        validationMessage: {
          required: "Alamat wajib diisi",
          maxLength: "Maksimal 200 karakter",
        },
      },
      {
        label: "Kode Rahasia",
        formName: "secretCode",
        type: "string",
        icon: FaKey,
        column: "1/2",
        showIcon: showSecretIcon,
        iconPosition: "right",
        iconOnClick: () => setShowSecretIcon(false),
        validation: { required: true },
      },
    ],
    [
      {
        label: "Urutan Prioritas",
        formName: "priorities",
        type: "dnd",
        column: "1",
        validation: {
          validate: (value: any) => value.length >= 3 || "Minimal 3 item",
        },
        validationMessage: {
          validate: "Harus ada minimal 3 prioritas",
        },
      },
    ],
  ];

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const handleFormChange = (data: any) => {
    console.log("Data berubah:", data);

    if (data?.agreement) {
      setAgreement(true); // Set state agreement ke true
    } else {
      setAgreement(false); // Set state agreement ke false
    }
  };

  return (
    <div className="container mx-auto w-8/12 p-4">
      <DynamicForm
        isDetail={isDetail}
        formData={isDetail ? detailPenjualanFormData : penjualanFormData}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        customStyles={{
          input: "bg-gray-100 p-2 rounded-lg",
          selection: "w-full p-0 rounded-lg",
          radioGroup: "space-x-4",
          slider: "w-full",
        }}
        submitButton={<CustomButtons setIsDetail={setIsDetail} />}
      />
    </div>
  );
}

export default App;
