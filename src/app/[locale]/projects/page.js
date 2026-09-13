// src/app/projects/page.js
"use client";

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';

import ProjectsPageContent from '@/components/pages/ProjectsPage'; // Renamed for clarity, though original name works
import ProjectDetail from '@/components/modals/ProjectDetail';

export default function ProjectsRoutePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all'); // State for filtering
  const [selectedProject, setSelectedProject] = useState(null); // State for modal

  return (
    <>
      {/* Ensure main content wrapper allows space for fixed header and is above AnimatedBackground */}
      <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 min-h-screen"> {/* Added pt and min-h-screen */}
        <ProjectsPageContent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedProject={setSelectedProject} // Pass down the modal setter
        />
      </div>
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}