// src/app/careers/page.js
"use client";
import React, { useState } from 'react';
import CareersPageContent from '@/components/pages/CareersPage';

export default function CareersRoutePage() {

  return (
    <>
      <div className="relative z-10">
        <CareersPageContent />
      </div>
    </>
  );
}