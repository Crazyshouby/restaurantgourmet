
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * This component helps ensure storage buckets exist for the application
 * It runs automatically on mount and creates the necessary buckets if they don't exist
 */
const StorageBucketCreator = () => {
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createBuckets = async () => {
      try {
        // Create event_images bucket if it doesn't exist
        const { data: eventBucketData, error: eventBucketError } = await supabase
          .storage
          .getBucket('event_images');

        if (eventBucketError && eventBucketError.message.includes('The resource was not found')) {
          // Create the bucket as it doesn't exist
          const { error } = await supabase
            .storage
            .createBucket('event_images', {
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });

          if (error) {
            console.error('Error creating event_images bucket:', error);
            setError('Failed to create event_images bucket');
          }
        }

        // Create profile_images bucket if it doesn't exist
        const { data: profileBucketData, error: profileBucketError } = await supabase
          .storage
          .getBucket('profile_images');

        if (profileBucketError && profileBucketError.message.includes('The resource was not found')) {
          // Create the bucket as it doesn't exist
          const { error } = await supabase
            .storage
            .createBucket('profile_images', {
              public: true,
              fileSizeLimit: 2097152 // 2MB
            });

          if (error) {
            console.error('Error creating profile_images bucket:', error);
            setError('Failed to create profile_images bucket');
          }
        }
      } catch (err) {
        console.error('Unexpected error creating buckets:', err);
        setError('Unexpected error creating storage buckets');
      } finally {
        setIsCreating(false);
      }
    };

    createBuckets();
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default StorageBucketCreator;
