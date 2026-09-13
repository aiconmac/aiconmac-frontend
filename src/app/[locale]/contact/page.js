// src/app/contact/page.js
"use client";
import React, { useState } from 'react';
import ContactPageContent from '@/components/pages/ContactPage';

export default function ContactRoutePage() {
  return (
    <>
      <div className="relative z-10">
        <ContactPageContent />
      </div>
    </>
  );
}