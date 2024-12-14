import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (checked) => {
    try {
      i18n.changeLanguage(checked ? 'en' : 'vi');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <GlobalOutlined style={{ fontSize: '16px' }} />
      <Switch
        checkedChildren="EN"
        unCheckedChildren="VI"
        checked={i18n.language === 'en'}
        onChange={handleChange}
      />
    </div>
  );
};

export default LanguageSwitcher;