import { motion } from 'framer-motion';
import { useAboutContentList } from '@/hooks/useAboutContent';
import { Layout } from '@/components/layout/Layout';
import { Loader2, AlertCircle, Calendar, Users, Truck, MessageSquare, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function AboutPage() {
  const { data: content = [], isLoading, isError } = useAboutContentList();

  // Helper function to get content by key
  const getContent = (key: string) => {
    const item = content.find(c => c.section_key === key);
    return item || null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || content.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              The About page is being set up. Please execute the database migration in your Supabase SQL Editor.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              See QUICK_SETUP.md for instructions.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const heroTitle = getContent('hero_title')?.title || '';
  const heroSubtitle = getContent('hero_subtitle')?.content || '';
  const storyTitle = getContent('story_title')?.title || '';
  const storyContent = getContent('story_content')?.content || '';
  const ownerName = getContent('owner_name')?.title || '';
  const ownerTitle = getContent('owner_title')?.title || '';
  const ownerQuote = getContent('owner_quote')?.content || '';
  const ownerImage = getContent('owner_image')?.image_url || '';
  const showroomTitle = getContent('showroom_title')?.title || '';
  const showroomSubtitle = getContent('showroom_subtitle')?.content || '';
  const showroomMain = getContent('showroom_main')?.image_url || '';
  
  // Showroom Contact Info
  const showroomAddress = getContent('showroom_address')?.content || 'Infront of Ram Janki mandir, mahadeva road, ara. 802301';
  const showroomPhone = getContent('showroom_phone')?.content || '+91 9470071791';
  const showroomEmail = getContent('showroom_email')?.content || 'guptatradersofficials@gmail.com';
  const showroomHoursWeekday = getContent('showroom_hours_weekday')?.content || 'Mon - Sat: 9:00 AM - 8:00 PM';
  const showroomHoursWeekend = getContent('showroom_hours_weekend')?.content || 'Sun: 9:00 AM - 8:00 PM';
  
  // Showroom gallery images
  const showroomImages = [
    getContent('showroom_image_1')?.image_url,
    getContent('showroom_image_2')?.image_url,
    getContent('showroom_image_3')?.image_url,
    getContent('showroom_image_4')?.image_url,
  ].filter(Boolean);

  // Stats
  const stats = [
    { key: 'stat_years', label: getContent('stat_years')?.title, sublabel: getContent('stat_years')?.content, icon: Calendar },
    { key: 'stat_customers', label: getContent('stat_customers')?.title, sublabel: getContent('stat_customers')?.content, icon: Users },
    { key: 'stat_products', label: getContent('stat_products')?.title, sublabel: getContent('stat_products')?.content, icon: Truck },
    { key: 'stat_cities', label: getContent('stat_cities')?.title, sublabel: getContent('stat_cities')?.content, icon: MapPin },
  ].filter(s => s.label);

  // Features for "What Sets Us Apart"
  const features = [
    { icon: Calendar, title: 'Quality Craftsmanship', description: 'Every piece of furniture is crafted with meticulous attention to detail and premium materials that stand the test of time.' },
    { icon: Users, title: 'Customer First', description: 'Your satisfaction is our priority. We go above and beyond to ensure every customer leaves with a smile.' },
    { icon: Truck, title: 'Reliable Delivery', description: 'Fast and reliable delivery to your doorstep. We handle every step of the delivery process with utmost care.' },
    { icon: MessageSquare, title: 'Expert Guidance', description: 'Our team of furniture experts is always ready to help you find the perfect pieces for your space.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {(heroTitle || heroSubtitle) && (
          <motion.section
            className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-block mb-4"
              >
                <span className="text-sm font-medium text-orange-600 uppercase tracking-wide">About Us</span>
              </motion.div>
              {heroTitle && (
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {heroTitle}
                </motion.h1>
              )}
              {heroSubtitle && (
                <motion.p
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {heroSubtitle}
                </motion.p>
              )}
            </div>
          </motion.section>
        )}

        {/* Stats Section */}
        {stats.length > 0 && (
          <motion.section
            className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      className="text-center p-4 md:p-6 rounded-lg"
                      variants={itemVariants}
                    >
                      <motion.div
                        className="flex justify-center mb-3"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-8 w-8 md:h-10 md:w-10 text-orange-600" />
                      </motion.div>
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                        {stat.label}
                      </div>
                      <p className="text-sm md:text-base text-gray-600">
                        {stat.sublabel}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Story Section with Gallery */}
        {(storyTitle || storyContent || showroomImages.length > 0) && (
          <motion.section
            className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* Gallery - Left Side */}
                {showroomImages.length > 0 && (
                  <motion.div className="order-1 md:order-1" variants={itemVariants}>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {showroomImages.map((image, idx) => (
                        <motion.div
                          key={idx}
                          className={`relative rounded-lg overflow-hidden group cursor-pointer ${
                            idx === 0 ? 'col-span-1 row-span-2 h-80 md:h-96' :
                            idx === 3 ? 'col-span-1 row-span-2 h-80 md:h-96' :
                            'h-40 md:h-44'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={image}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Text Content - Right Side */}
                <motion.div className="order-2 md:order-2 space-y-6" variants={itemVariants}>
                  {storyTitle && (
                    <div>
                      <motion.span
                        className="text-sm font-medium text-orange-600 uppercase tracking-wide"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        Our Story
                      </motion.span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        {storyTitle}
                      </h2>
                    </div>
                  )}
                  {storyContent && (
                    <div className="space-y-4">
                      {storyContent.split('\n\n').map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          className="text-base md:text-lg text-gray-600 leading-relaxed"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Owner/Founder Section */}
        {(ownerName || ownerTitle || ownerQuote) && (
          <motion.section
            className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-orange-100/30"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[1fr_240px] gap-8 md:gap-12 items-center">
                {/* Text Content */}
                <motion.div className="space-y-6" variants={itemVariants}>
                  {ownerName && (
                    <div>
                      <motion.span
                        className="text-sm font-medium text-orange-600 uppercase tracking-wide"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        Meet Our Founder
                      </motion.span>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        {ownerName}
                      </h3>
                      {ownerTitle && (
                        <p className="text-base md:text-lg text-orange-600 font-semibold mt-2">
                          {ownerTitle}
                        </p>
                      )}
                    </div>
                  )}
                  {ownerQuote && (
                    <blockquote className="border-l-4 border-orange-600 pl-6 py-2">
                      <p className="text-lg md:text-xl italic text-gray-700 font-medium">
                        {ownerQuote}
                      </p>
                    </blockquote>
                  )}
                </motion.div>

                {/* Image */}
                {ownerImage && (
                  <motion.div
                    className="relative h-56 w-56 md:h-64 md:w-64 mx-auto md:mx-0 rounded-full overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={ownerImage}
                      alt={ownerName}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Features Section - What Sets Us Apart */}
        <motion.section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What Sets Us Apart
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-10 w-10 text-orange-600" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Showroom Section */}
        {(showroomTitle || showroomMain) && (
          <motion.section
            className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <motion.span
                  className="text-sm font-medium text-orange-600 uppercase tracking-wide"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Visit Us
                </motion.span>
                {showroomTitle && (
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
                    {showroomTitle}
                  </h2>
                )}
                {showroomSubtitle && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {showroomSubtitle}
                  </p>
                )}
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                {/* Image */}
                {showroomMain && (
                  <motion.div
                    className="relative rounded-lg overflow-hidden h-80 md:h-full min-h-96 group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={showroomMain}
                      alt="Showroom"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </motion.div>
                )}

                {/* Contact Info */}
                <motion.div
                  className="space-y-6 flex flex-col justify-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className="flex gap-4 items-start p-6 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MapPin className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {showroomAddress}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4 items-start p-6 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Phone className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {showroomPhone}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4 items-start p-6 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {showroomEmail}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4 items-start p-6 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        {showroomHoursWeekday}<br />
                        {showroomHoursWeekend}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </Layout>
  );
}
