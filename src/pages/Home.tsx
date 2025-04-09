
import React from "react";
import Layout from "@/components/home/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
    </Layout>
  );
};

export default Home;
