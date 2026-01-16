'use client'
import React from 'react'
import { Image } from "@heroui/react";
import { CardWrapper } from '@/shared/ui/card';

export function Profile() {
  return (
    <div className='flex justify-between mt-[40px]'>
      <CardWrapper header={<>s</>}>
        <div>User profile content here</div>
      </CardWrapper>
      <Image
        isBlurred
        alt="HeroUI Album Cover"
        src="https://64.media.tumblr.com/fa9eb022d669189498ae479236035605/1e0c5300381792af-86/s640x960/b00d3c6b486760aaf6c0de640b88b90534bb91a5.jpg"
        width={240}
        radius='full'
      />
    </div>
  )
}
