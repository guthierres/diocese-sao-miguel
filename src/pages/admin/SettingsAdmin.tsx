import React, { useState, useEffect } from 'react';
import { Save, TestTube, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/cloudinary';
import { SiteSettings } from '../../types';

const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Cloudinary settings
  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const defaultSettings = {
          site_title: 'Diocese de São Miguel Paulista',
          site_description: 'Diocese de São Miguel Paulista - Evangelização e Serviço',
          about_diocese: '',
          contact_info: {},
          social_links: {},
        };
        setSettings(defaultSettings as SiteSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCloudinaryConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      // Create a test image (1x1 pixel transparent PNG)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
      
      const response = await fetch(testImageData);
      const blob = await response.blob();
      const testFile = new File([blob], 'test.png', { type: 'image/png' });

      await uploadImage(testFile);
      setConnectionStatus('success');
    } catch (error) {
      console.error('Cloudinary connection test failed:', error);
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const logoUrl = await uploadImage(file);
      setSettings(prev => prev ? { ...prev, logo_url: logoUrl } : null);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erro ao fazer upload do logo. Verifique as configurações do Cloudinary.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Site</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações gerais do site</p>
      </div>

      <div className="space-y-8">
        {/* Cloudinary Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações do Cloudinary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cloud Name
              </label>
              <input
                type="text"
                value={cloudinarySettings.cloudName}
                onChange={(e) => setCloudinarySettings(prev => ({ ...prev, cloudName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu-cloud-name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Preset
              </label>
              <input
                type="text"
                value={cloudinarySettings.uploadPreset}
                onChange={(e) => setCloudinarySettings(prev => ({ ...prev, uploadPreset: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu-upload-preset"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={testCloudinaryConnection}
              disabled={testingConnection}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingConnection ? 'Testando...' : 'Testar Conexão'}
            </button>

            {connectionStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                Conexão bem-sucedida!
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Falha na conexão. Verifique as configurações.
              </div>
            )}
          </div>
        </div>

        {/* Site Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Site</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo do Site
              </label>
              <div className="flex items-center space-x-4">
                {settings.logo_url && (
                  <img
                    src={settings.logo_url}
                    alt="Logo atual"
                    className="h-16 w-auto max-w-[200px] object-contain border rounded"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingLogo ? 'Enviando...' : 'Alterar Logo'}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Site
              </label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Site
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações de Contato</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <textarea
                value={(settings.contact_info as any)?.address || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: { ...(settings.contact_info as any), address: e.target.value }
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={(settings.contact_info as any)?.phone || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact_info: { ...(settings.contact_info as any), phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={(settings.contact_info as any)?.email || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact_info: { ...(settings.contact_info as any), email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Redes Sociais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={(settings.social_links as any)?.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: { ...(settings.social_links as any), facebook: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={(settings.social_links as any)?.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: { ...(settings.social_links as any), instagram: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={(settings.social_links as any)?.youtube || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: { ...(settings.social_links as any), youtube: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                value={(settings.social_links as any)?.twitter || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: { ...(settings.social_links as any), twitter: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;