
import React from 'react';
import ChildProfile from '@/components/ChildProfile';
import { ChildProfile as ChildProfileType } from '@/lib/feverGuide';

interface ProfileSectionProps {
  profiles: ChildProfileType[];
  selectedProfileId: string;
  onProfileSelect: (id: string) => void;
  onProfileAdd: (profile: ChildProfileType) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profiles,
  selectedProfileId,
  onProfileSelect,
  onProfileAdd
}) => {
  return (
    <ChildProfile 
      profiles={profiles}
      selectedProfileId={selectedProfileId}
      onProfileSelect={onProfileSelect}
      onProfileAdd={onProfileAdd}
    />
  );
};

export default ProfileSection;
