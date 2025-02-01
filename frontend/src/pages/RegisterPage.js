import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Flag from "react-world-flags";
import Select from "react-select";
import "../styles/register.css";

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

const countryCodes = [
  { code: "AF", dialCode: "+93", name: "Afghanistan" },
  { code: "AL", dialCode: "+355", name: "Albania" },
  { code: "DZ", dialCode: "+213", name: "Algeria" },
  { code: "AD", dialCode: "+376", name: "Andorra" },
  { code: "AO", dialCode: "+244", name: "Angola" },
  { code: "AR", dialCode: "+54", name: "Argentina" },
  { code: "AM", dialCode: "+374", name: "Armenia" },
  { code: "AU", dialCode: "+61", name: "Australia" },
  { code: "AT", dialCode: "+43", name: "Austria" },
  { code: "AZ", dialCode: "+994", name: "Azerbaijan" },
  { code: "BS", dialCode: "+1", name: "Bahamas" },
  { code: "BH", dialCode: "+973", name: "Bahrain" },
  { code: "BD", dialCode: "+880", name: "Bangladesh" },
  { code: "BB", dialCode: "+1", name: "Barbados" },
  { code: "BY", dialCode: "+375", name: "Belarus" },
  { code: "BE", dialCode: "+32", name: "Belgium" },
  { code: "BZ", dialCode: "+501", name: "Belize" },
  { code: "BJ", dialCode: "+229", name: "Benin" },
  { code: "BT", dialCode: "+975", name: "Bhutan" },
  { code: "BO", dialCode: "+591", name: "Bolivia" },
  { code: "BA", dialCode: "+387", name: "Bosnia and Herzegovina" },
  { code: "BW", dialCode: "+267", name: "Botswana" },
  { code: "BR", dialCode: "+55", name: "Brazil" },
  { code: "BN", dialCode: "+673", name: "Brunei" },
  { code: "BG", dialCode: "+359", name: "Bulgaria" },
  { code: "BF", dialCode: "+226", name: "Burkina Faso" },
  { code: "BI", dialCode: "+257", name: "Burundi" },
  { code: "KH", dialCode: "+855", name: "Cambodia" },
  { code: "CM", dialCode: "+237", name: "Cameroon" },
  { code: "CA", dialCode: "+1", name: "Canada" },
  { code: "CV", dialCode: "+238", name: "Cape Verde" },
  { code: "KY", dialCode: "+1", name: "Cayman Islands" },
  { code: "CF", dialCode: "+236", name: "Central African Republic" },
  { code: "TD", dialCode: "+235", name: "Chad" },
  { code: "CL", dialCode: "+56", name: "Chile" },
  { code: "CN", dialCode: "+86", name: "China" },
  { code: "CO", dialCode: "+57", name: "Colombia" },
  { code: "KM", dialCode: "+269", name: "Comoros" },
  { code: "CG", dialCode: "+242", name: "Congo" },
  { code: "CD", dialCode: "+243", name: "Democratic Republic of the Congo" },
  { code: "CR", dialCode: "+506", name: "Costa Rica" },
  { code: "HR", dialCode: "+385", name: "Croatia" },
  { code: "CU", dialCode: "+53", name: "Cuba" },
  { code: "CY", dialCode: "+357", name: "Cyprus" },
  { code: "CZ", dialCode: "+420", name: "Czech Republic" },
  { code: "DK", dialCode: "+45", name: "Denmark" },
  { code: "DJ", dialCode: "+253", name: "Djibouti" },
  { code: "DM", dialCode: "+1", name: "Dominica" },
  { code: "DO", dialCode: "+1", name: "Dominican Republic" },
  { code: "EC", dialCode: "+593", name: "Ecuador" },
  { code: "EG", dialCode: "+20", name: "Egypt" },
  { code: "SV", dialCode: "+503", name: "El Salvador" },
  { code: "GQ", dialCode: "+240", name: "Equatorial Guinea" },
  { code: "ER", dialCode: "+291", name: "Eritrea" },
  { code: "EE", dialCode: "+372", name: "Estonia" },
  { code: "ET", dialCode: "+251", name: "Ethiopia" },
  { code: "FJ", dialCode: "+679", name: "Fiji" },
  { code: "FI", dialCode: "+358", name: "Finland" },
  { code: "FR", dialCode: "+33", name: "France" },
  { code: "GA", dialCode: "+241", name: "Gabon" },
  { code: "GM", dialCode: "+220", name: "Gambia" },
  { code: "GE", dialCode: "+995", name: "Georgia" },
  { code: "DE", dialCode: "+49", name: "Germany" },
  { code: "GH", dialCode: "+233", name: "Ghana" },
  { code: "GR", dialCode: "+30", name: "Greece" },
  { code: "GT", dialCode: "+502", name: "Guatemala" },
  { code: "GN", dialCode: "+224", name: "Guinea" },
  { code: "GW", dialCode: "+245", name: "Guinea-Bissau" },
  { code: "GY", dialCode: "+592", name: "Guyana" },
  { code: "HT", dialCode: "+509", name: "Haiti" },
  { code: "HN", dialCode: "+504", name: "Honduras" },
  { code: "HK", dialCode: "+852", name: "Hong Kong" },
  { code: "HU", dialCode: "+36", name: "Hungary" },
  { code: "IS", dialCode: "+354", name: "Iceland" },
  { code: "IN", dialCode: "+91", name: "India" },
  { code: "ID", dialCode: "+62", name: "Indonesia" },
  { code: "IR", dialCode: "+98", name: "Iran" },
  { code: "IQ", dialCode: "+964", name: "Iraq" },
  { code: "IE", dialCode: "+353", name: "Ireland" },
  { code: "IL", dialCode: "+972", name: "Israel" },
  { code: "IT", dialCode: "+39", name: "Italy" },
  { code: "JM", dialCode: "+1", name: "Jamaica" },
  { code: "JP", dialCode: "+81", name: "Japan" },
  { code: "JO", dialCode: "+962", name: "Jordan" },
  { code: "KZ", dialCode: "+7", name: "Kazakhstan" },
  { code: "KE", dialCode: "+254", name: "Kenya" },
  { code: "KI", dialCode: "+686", name: "Kiribati" },
  { code: "KR", dialCode: "+82", name: "South Korea" },
  { code: "KW", dialCode: "+965", name: "Kuwait" },
  { code: "KG", dialCode: "+996", name: "Kyrgyzstan" },
  { code: "LA", dialCode: "+856", name: "Laos" },
  { code: "LV", dialCode: "+371", name: "Latvia" },
  { code: "LB", dialCode: "+961", name: "Lebanon" },
  { code: "LS", dialCode: "+266", name: "Lesotho" },
  { code: "LR", dialCode: "+231", name: "Liberia" },
  { code: "LY", dialCode: "+218", name: "Libya" },
  { code: "LI", dialCode: "+423", name: "Liechtenstein" },
  { code: "LT", dialCode: "+370", name: "Lithuania" },
  { code: "LU", dialCode: "+352", name: "Luxembourg" },
  { code: "MO", dialCode: "+853", name: "Macau" },
  { code: "MK", dialCode: "+389", name: "North Macedonia" },
  { code: "MG", dialCode: "+261", name: "Madagascar" },
  { code: "MW", dialCode: "+265", name: "Malawi" },
  { code: "MY", dialCode: "+60", name: "Malaysia" },
  { code: "MV", dialCode: "+960", name: "Maldives" },
  { code: "ML", dialCode: "+223", name: "Mali" },
  { code: "MT", dialCode: "+356", name: "Malta" },
  { code: "MH", dialCode: "+692", name: "Marshall Islands" },
  { code: "MQ", dialCode: "+596", name: "Martinique" },
  { code: "MR", dialCode: "+222", name: "Mauritania" },
  { code: "MU", dialCode: "+230", name: "Mauritius" },
  { code: "YT", dialCode: "+262", name: "Mayotte" },
  { code: "MX", dialCode: "+52", name: "Mexico" },
  { code: "FM", dialCode: "+691", name: "Micronesia" },
  { code: "MD", dialCode: "+373", name: "Moldova" },
  { code: "MC", dialCode: "+377", name: "Monaco" },
  { code: "MN", dialCode: "+976", name: "Mongolia" },
  { code: "ME", dialCode: "+382", name: "Montenegro" },
  { code: "MS", dialCode: "+1", name: "Montserrat" },
  { code: "MA", dialCode: "+212", name: "Morocco" },
  { code: "MZ", dialCode: "+258", name: "Mozambique" },
  { code: "MM", dialCode: "+95", name: "Myanmar" },
  { code: "NA", dialCode: "+264", name: "Namibia" },
  { code: "NR", dialCode: "+674", name: "Nauru" },
  { code: "NP", dialCode: "+977", name: "Nepal" },
  { code: "NL", dialCode: "+31", name: "Netherlands" },
  { code: "NC", dialCode: "+687", name: "New Caledonia" },
  { code: "NZ", dialCode: "+64", name: "New Zealand" },
  { code: "NI", dialCode: "+505", name: "Nicaragua" },
  { code: "NE", dialCode: "+227", name: "Niger" },
  { code: "NG", dialCode: "+234", name: "Nigeria" },
  { code: "NU", dialCode: "+683", name: "Niue" },
  { code: "NF", dialCode: "+672", name: "Norfolk Island" },
  { code: "MP", dialCode: "+1", name: "Northern Mariana Islands" },
  { code: "NO", dialCode: "+47", name: "Norway" },
  { code: "OM", dialCode: "+968", name: "Oman" },
  { code: "PK", dialCode: "+92", name: "Pakistan" },
  { code: "PW", dialCode: "+680", name: "Palau" },
  { code: "PA", dialCode: "+507", name: "Panama" },
  { code: "PG", dialCode: "+675", name: "Papua New Guinea" },
  { code: "PY", dialCode: "+595", name: "Paraguay" },
  { code: "PE", dialCode: "+51", name: "Peru" },
  { code: "PH", dialCode: "+63", name: "Philippines" },
  { code: "PN", dialCode: "+870", name: "Pitcairn Islands" },
  { code: "PL", dialCode: "+48", name: "Poland" },
  { code: "PT", dialCode: "+351", name: "Portugal" },
  { code: "PR", dialCode: "+1", name: "Puerto Rico" },
  { code: "QA", dialCode: "+974", name: "Qatar" },
  { code: "RE", dialCode: "+262", name: "Reunion" },
  { code: "RO", dialCode: "+40", name: "Romania" },
  { code: "RU", dialCode: "+7", name: "Russia" },
  { code: "RW", dialCode: "+250", name: "Rwanda" },
  { code: "BL", dialCode: "+590", name: "Saint Barthélemy" },
  { code: "SH", dialCode: "+290", name: "Saint Helena" },
  { code: "KN", dialCode: "+1", name: "Saint Kitts and Nevis" },
  { code: "LC", dialCode: "+1", name: "Saint Lucia" },
  { code: "MF", dialCode: "+590", name: "Saint Martin" },
  { code: "SX", dialCode: "+1", name: "Sint Maarten" },
  { code: "ST", dialCode: "+239", name: "São Tomé and Príncipe" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia" },
  { code: "SN", dialCode: "+221", name: "Senegal" },
  { code: "RS", dialCode: "+381", name: "Serbia" },
  { code: "SC", dialCode: "+248", name: "Seychelles" },
  { code: "SL", dialCode: "+232", name: "Sierra Leone" },
  { code: "SG", dialCode: "+65", name: "Singapore" },
  { code: "SK", dialCode: "+421", name: "Slovakia" },
  { code: "SI", dialCode: "+386", name: "Slovenia" },
  { code: "SB", dialCode: "+677", name: "Solomon Islands" },
  { code: "SO", dialCode: "+252", name: "Somalia" },
  { code: "ZA", dialCode: "+27", name: "South Africa" },
  { code: "SS", dialCode: "+211", name: "South Sudan" },
  { code: "ES", dialCode: "+34", name: "Spain" },
  { code: "LK", dialCode: "+94", name: "Sri Lanka" },
  { code: "SD", dialCode: "+249", name: "Sudan" },
  { code: "SR", dialCode: "+597", name: "Suriname" },
  { code: "SZ", dialCode: "+268", name: "Swaziland" },
  { code: "SE", dialCode: "+46", name: "Sweden" },
  { code: "CH", dialCode: "+41", name: "Switzerland" },
  { code: "SY", dialCode: "+963", name: "Syria" },
  { code: "TW", dialCode: "+886", name: "Taiwan" },
  { code: "TJ", dialCode: "+992", name: "Tajikistan" },
  { code: "TZ", dialCode: "+255", name: "Tanzania" },
  { code: "TH", dialCode: "+66", name: "Thailand" },
  { code: "TG", dialCode: "+228", name: "Togo" },
  { code: "TK", dialCode: "+690", name: "Tokelau" },
  { code: "TO", dialCode: "+676", name: "Tonga" },
  { code: "TT", dialCode: "+1", name: "Trinidad and Tobago" },
  { code: "TN", dialCode: "+216", name: "Tunisia" },
  { code: "TR", dialCode: "+90", name: "Turkey" },
  { code: "TM", dialCode: "+993", name: "Turkmenistan" },
  { code: "TC", dialCode: "+1", name: "Turks and Caicos Islands" },
  { code: "TV", dialCode: "+688", name: "Tuvalu" },
  { code: "UG", dialCode: "+256", name: "Uganda" },
  { code: "UA", dialCode: "+380", name: "Ukraine" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "US", dialCode: "+1", name: "United States" },
  { code: "UY", dialCode: "+598", name: "Uruguay" },
  { code: "UZ", dialCode: "+998", name: "Uzbekistan" },
  { code: "VU", dialCode: "+678", name: "Vanuatu" },
  { code: "VE", dialCode: "+58", name: "Venezuela" },
  { code: "VN", dialCode: "+84", name: "Vietnam" },
  { code: "WF", dialCode: "+681", name: "Wallis and Futuna" },
  { code: "EH", dialCode: "+212", name: "Western Sahara" },
  { code: "YE", dialCode: "+967", name: "Yemen" },
  { code: "ZM", dialCode: "+260", name: "Zambia" },
  { code: "ZW", dialCode: "+263", name: "Zimbabwe" },
];

const RegistrationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+380", // Код країни за замовчуванням
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCountryChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      countryCode: selectedOption.value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    // Перевірка на надійність паролю
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@%&*,.?":]{8,}$/; // Мінімум 8 символів, одна велика буква, одна цифра
    return regex.test(password);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const matchedCode = countryCodes.find((country) =>
        value.startsWith(country.dialCode)
      );
      if (matchedCode) {
        setFormData((prevData) => ({
          ...prevData,
          phone: value,
          countryCode: matchedCode.dialCode,
        }));
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateEmail(formData.email)) {
      setError("Invalid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Пароль повинен містити мінімум 8 символів, одну велику літеру та одну цифру.",
      }));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.phone.length < 7 || formData.phone.length > 15) {
      setError("Phone number must be between 7 and 15 digits.");
      return;
    }

    const payload = {
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone.replace(
        formData.countryCode,
        ""
      )}`,
      name: formData.name,
      hashed_password: formData.password, // Ideally hashed on the backend
    };

    try {
      const response = await api.post("/user/create", payload);
      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          countryCode: "+380",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const countryOptions = countryCodes.map((country) => ({
    value: country.dialCode,
    label: (
      <div className="flex items-center">
        <Flag
          code={country.code}
          style={{ width: "24px", height: "16px", marginRight: "8px" }}
        />
        {country.dialCode}
      </div>
    ),
  }));

  return (
    <div className="h-[100vh] w-full flex items-center justify-center bg-[#F3F4F6]">
      <div className="flex flex-col w-full max-w-[500px] mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
        <h1 className="text-accent-purple font-bold text-3xl text-center mb-4">
          Register
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="pb-4">
            <label className="block mb-2 text-sm font-medium text-[#111827]">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={formData.name}
              placeholder="Your Name"
              autoComplete="name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="pb-4">
            <label className="block mb-2 text-sm font-medium text-[#111827]">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={formData.email}
              autoComplete="email"
              placeholder="market@marketplace.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="pb-4">
            <label className="block mb-2 text-sm font-medium text-[#111827]">
              Phone
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400">
              <div className="w-[130px]">
                <Select
                  styles={{
                    control: (base) => ({
                      ...base,
                      outline: "none",
                      boxShadow: "none",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#6A63CA"
                        : state.isFocused
                        ? "#CBD0F9"
                        : base.backgroundColor,
                      color: state.isSelected ? "#fff" : base.color,
                      ":hover": {
                        backgroundColor: state.isSelected
                          ? "#6A63CA"
                          : "#CBD0F9",
                      },
                    }),
                  }}
                  className="phone-select-container"
                  classNamePrefix="phone-select"
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.countryCode
                  )}
                  onChange={handleCountryChange}
                  isSearchable={false}
                />
              </div>
              <input
                type="text"
                name="phone"
                className="flex-grow p-3 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+380000000000"
                autoComplete="tel"
                maxLength="15"
                required
              />
            </div>
          </div>

          <div className="pb-4">
            <label className="block mb-2 text-sm font-medium text-[#111827]">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="pb-4">
            <label className="block mb-2 text-sm font-medium text-[#111827]">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={formData.confirmPassword}
              placeholder="••••••••••"
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-[#FFFFFF] bg-accent-purple focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mb-4">
              Registration successful!
            </p>
          )}
          <div className="text-sm font-light text-[#6B7280] text-center">
            Already have an account yet?{" "}
            <Link
              to="/login"
              className="font-medium text-accent-purple hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
