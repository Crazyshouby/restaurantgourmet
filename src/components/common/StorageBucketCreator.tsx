
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

        if (eventBucketError) {
          console.log('Event bucket check error:', eventBucketError);
          
          // Create the bucket if it doesn't exist
          const { error } = await supabase
            .storage
            .createBucket('event_images', {
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });

          if (error) {
            console.error('Error creating event_images bucket:', error);
            setError('Failed to create event_images bucket');
            toast.error('Failed to create event_images bucket');
          } else {
            console.log('Successfully created event_images bucket');
            toast.success('Event images bucket created');
            
            // Add public bucket policy
            const { error: policyError } = await supabase
              .storage
              .from('event_images')
              .createSignedUrl('dummy-path', 1); // This is just to trigger policy creation
              
            if (policyError) {
              console.log('Note: Expected error for dummy URL', policyError);
            }
          }
        } else {
          console.log('Event images bucket already exists');
        }

        // Create profile_images bucket if it doesn't exist
        const { data: profileBucketData, error: profileBucketError } = await supabase
          .storage
          .getBucket('profile_images');

        if (profileBucketError) {
          console.log('Profile bucket check error:', profileBucketError);
          
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
            toast.error('Failed to create profile_images bucket');
          } else {
            console.log('Successfully created profile_images bucket');
            toast.success('Profile images bucket created');
            
            // Add public bucket policy
            const { error: policyError } = await supabase
              .storage
              .from('profile_images')
              .createSignedUrl('dummy-path', 1); // This is just to trigger policy creation
              
            if (policyError) {
              console.log('Note: Expected error for dummy URL', policyError);
            }
          }
        } else {
          console.log('Profile images bucket already exists');
        }
      } catch (err) {
        console.error('Unexpected error creating buckets:', err);
        setError('Unexpected error creating storage buckets');
        toast.error('Failed to set up image storage');
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
