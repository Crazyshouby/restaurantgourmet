
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * This component verifies storage buckets exist for the application
 * It runs automatically on mount and notifies the user about bucket status
 */
const StorageBucketCreator = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // Check if buckets exist and are accessible
        const eventBucketCheck = await checkBucket('event_images');
        const profileBucketCheck = await checkBucket('profile_images', false); // Silent check for profile_images
        
        if (eventBucketCheck) {
          console.log('Event images bucket is properly configured and accessible');
        } else {
          console.error('Event images bucket is not accessible');
          setError('Event images bucket is not accessible');
          toast.error('Failed to access event images bucket');
        }
        
        if (!profileBucketCheck) {
          // Only log this error, don't display toast for profile_images
          console.log('Profile images bucket is not accessible, but this may not affect core functionality');
        }
      } catch (err) {
        console.error('Unexpected error checking buckets:', err);
        setError('Unexpected error checking storage buckets');
        toast.error('Failed to set up image storage');
      } finally {
        setIsChecking(false);
      }
    };

    // Helper function to check if a bucket exists and is accessible
    const checkBucket = async (bucketName: string, showError: boolean = true): Promise<boolean> => {
      try {
        // Try to get bucket info to verify it exists
        const { data, error } = await supabase
          .storage
          .getBucket(bucketName);

        if (error) {
          console.log(`${bucketName} bucket check error:`, error);
          return false;
        }

        // Try to get a public URL to verify proper policy setup
        const { data: urlData } = await supabase
          .storage
          .from(bucketName)
          .getPublicUrl('test-access');
          
        console.log(`${bucketName} bucket is accessible, public URL:`, urlData.publicUrl);
        return true;
      } catch (err) {
        console.error(`Error checking ${bucketName} bucket:`, err);
        return false;
      }
    };

    checkBuckets();
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default StorageBucketCreator;
