import React, { useState, useRef, useEffect } from 'react';
import './PhoneInput.css';

const countries = [
    { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
    { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
    { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
    { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
    { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
    { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
    { code: 'ES', name: 'Spain (España)', dial: '+34', flag: '🇪🇸' },
    { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
    { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
    { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
    { code: 'AF', name: 'Afghanistan (افغانستان)', dial: '+93', flag: '🇦🇫' },
    { code: 'AL', name: 'Albania (Shqipëri)', dial: '+355', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria (الجزائر)', dial: '+213', flag: '🇩🇿' },
    { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
];

const PhoneInput = ({ value, onChange, error, name = 'phone', defaultCountry = 'PK' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(
        countries.find(c => c.code === defaultCountry) || countries[0]
    );
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial.includes(searchTerm)
    );

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchTerm('');

        // Notify parent of changes
        onChange({
            target: {
                name,
                value: value,
                fullValue: `${country.dial}${value}`,
                countryCode: country.code,
                dialCode: country.dial
            }
        });
    };

    const handlePhoneChange = (e) => {
        const phoneNumber = e.target.value.replace(/\D/g, ''); // Only digits
        onChange({
            target: {
                name,
                value: phoneNumber,
                fullValue: `${selectedCountry.dial}${phoneNumber}`,
                countryCode: selectedCountry.code,
                dialCode: selectedCountry.dial
            }
        });
    };

    return (
        <div className="phone-input-container" ref={dropdownRef}>
            <div className={`phone-input-wrapper ${error ? 'has-error' : ''}`}>
                {/* Country Selector */}
                <button
                    type="button"
                    className="country-selector"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="country-flag">{selectedCountry.flag}</span>
                    <span className="country-dial">{selectedCountry.dial}</span>
                    <span className="dropdown-arrow">▼</span>
                </button>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    className="phone-number-input"
                    value={value}
                    onChange={handlePhoneChange}
                    placeholder="3XX XXXXXXX"
                    maxLength="15"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="country-dropdown">
                    <div className="dropdown-search">
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="country-list">
                        {filteredCountries.map((country) => (
                            <li
                                key={country.code}
                                className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                                onClick={() => handleCountrySelect(country)}
                            >
                                <span className="country-flag">{country.flag}</span>
                                <span className="country-name">{country.name}</span>
                                <span className="country-dial-code">{country.dial}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Error Message */}
            {error && <div className="phone-error">{error}</div>}
        </div>
    );
};

export default PhoneInput;
