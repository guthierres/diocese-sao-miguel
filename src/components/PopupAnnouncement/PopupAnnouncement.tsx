import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PopupAnnouncement as PopupAnnouncementType } from '../../types';

const PopupAnnouncement: React.FC = () => {
  const [announcement, setAnnouncement] = useState<PopupAnnouncementType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchActiveAnnouncement();
  }, []);

  const fetchActiveAnnouncement = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('popup_announcements')
        .select('*')
        .eq('active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Check if user has already seen this announcement
        const seenKey = `popup_seen_${data.id}`;
        const hasSeenAnnouncement = localStorage.getItem(seenKey);
        
        if (!hasSeenAnnouncement) {
          setAnnouncement(data);
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching popup announcement:', error);
    }
  };

  const closePopup = () => {
    if (announcement) {
      localStorage.setItem(`popup_seen_${announcement.id}`, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          {announcement.image && (
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">
              {announcement.title}
            </h2>
            <div
              className="text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAnnouncement;