
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
        // First, let's check if RLS is preventing bucket creation
        // If so, we'll try to make the buckets public
        
        // Create event_images bucket with retries
        let eventBucketCreated = false;
        let retries = 0;
        
        while (!eventBucketCreated && retries < 3) {
          try {
            // Check if event_images bucket exists
            const { data: eventBucketData, error: eventBucketError } = await supabase
              .storage
              .getBucket('event_images');

            if (eventBucketError) {
              console.log('Event bucket check error:', eventBucketError);
              
              // Try to create the bucket
              const { error } = await supabase
                .storage
                .createBucket('event_images', {
                  public: true,
                  fileSizeLimit: 5242880 // 5MB
                });

              if (error) {
                console.error(`Error creating event_images bucket (attempt ${retries + 1}):`, error);
                retries++;
                
                if (retries >= 3) {
                  setError('Failed to create event_images bucket');
                  toast.error('Failed to create event_images bucket');
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                console.log('Successfully created event_images bucket');
                toast.success('Event images bucket created');
                eventBucketCreated = true;
                
                // Try to update bucket's public access
                try {
                  const { data: policyData, error: policyError } = await supabase
                    .storage
                    .from('event_images')
                    .getPublicUrl('dummy-path');
                    
                  if (policyError) {
                    console.log('Error setting public policy:', policyError);
                  }
                } catch (policyErr) {
                  console.log('Policy setting error:', policyErr);
                }
              }
            } else {
              console.log('Event images bucket already exists');
              eventBucketCreated = true;
            }
          } catch (err) {
            console.error(`Unexpected error during event bucket creation (attempt ${retries + 1}):`, err);
            retries++;
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Create profile_images bucket with similar retry logic
        let profileBucketCreated = false;
        retries = 0;
        
        while (!profileBucketCreated && retries < 3) {
          try {
            // Check if profile_images bucket exists
            const { data: profileBucketData, error: profileBucketError } = await supabase
              .storage
              .getBucket('profile_images');

            if (profileBucketError) {
              console.log('Profile bucket check error:', profileBucketError);
              
              // Try to create the bucket
              const { error } = await supabase
                .storage
                .createBucket('profile_images', {
                  public: true,
                  fileSizeLimit: 2097152 // 2MB
                });

              if (error) {
                console.error(`Error creating profile_images bucket (attempt ${retries + 1}):`, error);
                retries++;
                
                if (retries >= 3) {
                  setError('Failed to create profile_images bucket');
                  toast.error('Failed to create profile_images bucket');
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                console.log('Successfully created profile_images bucket');
                toast.success('Profile images bucket created');
                profileBucketCreated = true;
                
                // Try to update bucket's public access
                try {
                  const { data: policyData, error: policyError } = await supabase
                    .storage
                    .from('profile_images')
                    .getPublicUrl('dummy-path');
                    
                  if (policyError) {
                    console.log('Error setting public policy:', policyError);
                  }
                } catch (policyErr) {
                  console.log('Policy setting error:', policyErr);
                }
              }
            } else {
              console.log('Profile images bucket already exists');
              profileBucketCreated = true;
            }
          } catch (err) {
            console.error(`Unexpected error during profile bucket creation (attempt ${retries + 1}):`, err);
            retries++;
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
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
