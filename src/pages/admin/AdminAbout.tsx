import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAboutContentList, useUpdateAboutContent, AboutContent } from '@/hooks/useAboutContent';
import { AboutImageUpload } from '@/components/admin/AboutImageUpload';
import { 
  Save, 
  User, 
  FileText, 
  BarChart3, 
  Image, 
  Loader2, 
  Sparkles, 
  Layout,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  category: 'hero' | 'story' | 'owner' | 'showroom' | 'stats';
  placeholder?: string;
}

const CONTENT_FIELDS: ContentField[] = [
  { key: 'hero_title', label: 'Hero Title', type: 'text', category: 'hero', placeholder: 'Your main headline...' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', category: 'hero', placeholder: 'A compelling subtitle...' },
  { key: 'story_title', label: 'Section Title', type: 'text', category: 'story', placeholder: 'Our Story' },
  { key: 'story_content', label: 'Story Content', type: 'textarea', category: 'story', placeholder: 'Tell your brand story...' },
  { key: 'owner_name', label: 'Name', type: 'text', category: 'owner', placeholder: 'Full name' },
  { key: 'owner_title', label: 'Position', type: 'text', category: 'owner', placeholder: 'e.g. Founder & CEO' },
  { key: 'owner_quote', label: 'Quote', type: 'textarea', category: 'owner', placeholder: 'A memorable quote...' },
  { key: 'owner_image', label: 'Profile Photo', type: 'image', category: 'owner' },
  { key: 'showroom_title', label: 'Section Title', type: 'text', category: 'showroom', placeholder: 'Visit Our Showroom' },
  { key: 'showroom_subtitle', label: 'Description', type: 'textarea', category: 'showroom', placeholder: 'Describe your showroom...' },
  { key: 'showroom_image_1', label: 'Gallery Image 1', type: 'image', category: 'showroom' },
  { key: 'showroom_image_2', label: 'Gallery Image 2', type: 'image', category: 'showroom' },
  { key: 'showroom_image_3', label: 'Gallery Image 3', type: 'image', category: 'showroom' },
  { key: 'showroom_image_4', label: 'Gallery Image 4', type: 'image', category: 'showroom' },
  { key: 'showroom_main', label: 'Main Image', type: 'image', category: 'showroom' },
  { key: 'stat_years', label: 'Years', type: 'text', category: 'stats', placeholder: '15+' },
  { key: 'stat_customers', label: 'Customers', type: 'text', category: 'stats', placeholder: '10,000+' },
  { key: 'stat_products', label: 'Products', type: 'text', category: 'stats', placeholder: '500+' },
  { key: 'stat_cities', label: 'Cities', type: 'text', category: 'stats', placeholder: '25+' },
];

const CATEGORIES = [
  { id: 'hero', label: 'Hero', icon: Layout, description: 'Main headline & intro' },
  { id: 'story', label: 'Story', icon: FileText, description: 'Brand narrative' },
  { id: 'owner', label: 'Owner', icon: User, description: 'Founder details' },
  { id: 'showroom', label: 'Gallery', icon: Image, description: 'Visual showcase' },
  { id: 'stats', label: 'Stats', icon: BarChart3, description: 'Key metrics' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } }
};

export default function AdminAbout() {
  const { data: contentList = [], isLoading } = useAboutContentList(true);
  const updateContent = useUpdateAboutContent();
  const [formData, setFormData] = useState<Record<string, { id: string; title: string; content: string; image_url: string }>>({});
  const [activeCategory, setActiveCategory] = useState('hero');
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (contentList.length > 0) {
      const initialData: Record<string, { id: string; title: string; content: string; image_url: string }> = {};
      contentList.forEach(item => {
        initialData[item.section_key] = {
          id: item.id,
          title: item.title || '',
          content: item.content || '',
          image_url: item.image_url || '',
        };
      });
      setFormData(initialData);
    }
  }, [contentList]);

  const handleFieldChange = (key: string, field: 'title' | 'content' | 'image_url', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
    setSavedFields(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSave = async (sectionKey: string) => {
    const data = formData[sectionKey];
    if (!data) return;

    const field = CONTENT_FIELDS.find(f => f.key === sectionKey);
    if (!field) return;

    let updatePayload: Partial<AboutContent> & { id: string } = { id: data.id };

    if (field.type === 'image') {
      updatePayload.image_url = data.image_url || null;
    } else if (field.key.startsWith('stat_')) {
      updatePayload.title = data.title;
      updatePayload.content = data.content;
    } else {
      updatePayload.title = data.title || null;
      updatePayload.content = data.content || null;
    }

    await updateContent.mutateAsync(updatePayload);
    setSavedFields(prev => new Set(prev).add(sectionKey));
    setTimeout(() => {
      setSavedFields(prev => {
        const next = new Set(prev);
        next.delete(sectionKey);
        return next;
      });
    }, 2000);
  };

  const getAspectRatio = (key: string): number => {
    if (key === 'owner_image') return 1;
    if (key.includes('image_1') || key.includes('image_4')) return 4 / 5;
    if (key.includes('image_2') || key.includes('image_3')) return 1;
    if (key === 'showroom_main') return 4 / 3;
    return 16 / 9;
  };

  const getValue = (key: string): string => {
    const field = CONTENT_FIELDS.find(f => f.key === key);
    if (!field) return '';
    const data = formData[key];
    if (!data) return '';
    if (field.type === 'image') return data.image_url || '';
    if (field.key.startsWith('stat_')) return data.title || '';
    if (field.type === 'textarea') {
      return key.includes('content') || key.includes('subtitle') || key.includes('quote') 
        ? data.content || '' 
        : data.title || '';
    }
    return data.title || '';
  };

  const getStatLabel = (key: string): string => formData[key]?.content || '';

  const handleChange = (key: string, value: string) => {
    const field = CONTENT_FIELDS.find(f => f.key === key);
    if (!field) return;
    if (field.type === 'image') {
      handleFieldChange(key, 'image_url', value);
    } else if (field.key.startsWith('stat_')) {
      handleFieldChange(key, 'title', value);
    } else if (field.type === 'textarea') {
      if (key.includes('content') || key.includes('subtitle') || key.includes('quote')) {
        handleFieldChange(key, 'content', value);
      } else {
        handleFieldChange(key, 'title', value);
      }
    } else {
      handleFieldChange(key, 'title', value);
    }
  };

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory);
  const categoryFields = CONTENT_FIELDS.filter(f => f.category === activeCategory);

  return (
    <AdminLayout>
      <div className="min-h-full w-full max-w-full overflow-x-hidden">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 mb-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-display font-bold tracking-tight text-foreground truncate">
              About Page
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground ml-9 sm:ml-12">
            Customize your brand story
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        ) : contentList.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-md p-6 border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="text-center space-y-3">
                <Sparkles className="h-8 w-8 text-amber-600 dark:text-amber-500 mx-auto" />
                <h3 className="font-semibold text-foreground">Database Not Ready</h3>
                <p className="text-sm text-muted-foreground">
                  The database migration hasn't been executed yet. Please run the SQL migration in your Supabase SQL Editor.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                    Go to Supabase
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-[240px_1fr] w-full max-w-full">
            {/* Category Navigation */}
            <div className="lg:sticky lg:top-4 lg:self-start w-full max-w-full overflow-hidden">
              {/* Mobile: Horizontal scroll */}
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 lg:hidden scrollbar-hide">
                {CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    )}
                  >
                    <cat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {cat.label}
                  </motion.button>
                ))}
              </div>

              {/* Desktop: Sidebar navigation */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="hidden lg:flex flex-col gap-1.5"
              >
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  const fieldsCount = CONTENT_FIELDS.filter(f => f.category === cat.id).length;
                  
                  return (
                    <motion.button
                      key={cat.id}
                      variants={itemVariants}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-card hover:bg-muted border border-border/50 hover:border-border"
                      )}
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center transition-colors shrink-0",
                        isActive ? "bg-primary-foreground/20" : "bg-muted group-hover:bg-background"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          !isActive && "text-foreground"
                        )}>
                          {cat.label}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {fieldsCount} fields
                        </p>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isActive ? "text-primary-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100",
                        isActive && "translate-x-0.5"
                      )} />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border border-border/50 shadow-sm overflow-hidden w-full max-w-full">
                  <CardHeader className="bg-gradient-to-br from-muted/50 to-muted/30 border-b border-border/50 p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {currentCategory && (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <currentCategory.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm sm:text-base lg:text-xl truncate">
                          {currentCategory?.label} Section
                        </CardTitle>
                        <CardDescription className="text-[11px] sm:text-xs lg:text-sm truncate">
                          {currentCategory?.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-hidden">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {/* Showroom Category */}
                      {activeCategory === 'showroom' && (
                        <div className="space-y-4 sm:space-y-6 w-full max-w-full">
                          {/* Text fields grid */}
                          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 w-full">
                            {categoryFields.filter(f => f.type !== 'image').map(field => (
                              <motion.div key={field.key} variants={itemVariants} className="w-full min-w-0">
                                <FieldEditor
                                  field={field}
                                  value={getValue(field.key)}
                                  onChange={(val) => handleChange(field.key, val)}
                                  onSave={() => handleSave(field.key)}
                                  isSaving={updateContent.isPending}
                                  isSaved={savedFields.has(field.key)}
                                />
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Image gallery grid */}
                          <div className="w-full">
                            <Label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 block text-foreground">Gallery Images</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full">
                              {categoryFields.filter(f => f.type === 'image').map(field => (
                                <motion.div key={field.key} variants={itemVariants} className="space-y-1.5 sm:space-y-2 min-w-0">
                                  <AboutImageUpload
                                    value={getValue(field.key)}
                                    onChange={(url) => handleChange(field.key, url)}
                                    label={field.label}
                                    aspectRatio={getAspectRatio(field.key)}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-[10px] sm:text-xs h-7 sm:h-8 gap-1 sm:gap-1.5 px-2"
                                    onClick={() => handleSave(field.key)}
                                    disabled={updateContent.isPending}
                                  >
                                    {savedFields.has(field.key) ? (
                                      <>
                                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                                        <span>Saved</span>
                                      </>
                                    ) : updateContent.isPending ? (
                                      <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                                    ) : (
                                      <>
                                        <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        <span>Save</span>
                                      </>
                                    )}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stats Category */}
                      {activeCategory === 'stats' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full">
                          {categoryFields.map(field => (
                            <motion.div key={field.key} variants={itemVariants} className="min-w-0">
                              <Card className="p-3 sm:p-4 bg-muted/30 border-border/50 hover:border-border transition-colors">
                                <div className="space-y-2 sm:space-y-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <Label className="text-xs sm:text-sm font-semibold text-foreground truncate">{field.label}</Label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 shrink-0"
                                      onClick={() => handleSave(field.key)}
                                      disabled={updateContent.isPending}
                                    >
                                      {savedFields.has(field.key) ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                                      ) : updateContent.isPending ? (
                                        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                      ) : (
                                        <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                      )}
                                    </Button>
                                  </div>
                                  <Input
                                    value={getValue(field.key)}
                                    onChange={e => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="text-lg sm:text-xl lg:text-2xl font-bold h-10 sm:h-12 bg-background"
                                  />
                                  <Input
                                    value={getStatLabel(field.key)}
                                    onChange={e => handleFieldChange(field.key, 'content', e.target.value)}
                                    placeholder="Label"
                                    className="text-xs sm:text-sm h-8 sm:h-9 bg-background"
                                  />
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Owner Category */}
                      {activeCategory === 'owner' && (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_200px] w-full">
                          <div className="space-y-3 sm:space-y-4 order-2 lg:order-1 min-w-0">
                            {categoryFields.filter(f => f.type !== 'image').map(field => (
                              <motion.div key={field.key} variants={itemVariants} className="min-w-0">
                                <FieldEditor
                                  field={field}
                                  value={getValue(field.key)}
                                  onChange={(val) => handleChange(field.key, val)}
                                  onSave={() => handleSave(field.key)}
                                  isSaving={updateContent.isPending}
                                  isSaved={savedFields.has(field.key)}
                                />
                              </motion.div>
                            ))}
                          </div>
                          <div className="order-1 lg:order-2 w-full max-w-[180px] sm:max-w-[200px] mx-auto lg:mx-0">
                            {categoryFields.filter(f => f.type === 'image').map(field => (
                              <motion.div key={field.key} variants={itemVariants} className="space-y-1.5 sm:space-y-2">
                                <Label className="text-xs sm:text-sm font-semibold text-foreground">{field.label}</Label>
                                <AboutImageUpload
                                  value={getValue(field.key)}
                                  onChange={(url) => handleChange(field.key, url)}
                                  label={field.label}
                                  aspectRatio={1}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-[10px] sm:text-xs h-7 sm:h-8 gap-1 sm:gap-1.5"
                                  onClick={() => handleSave(field.key)}
                                  disabled={updateContent.isPending}
                                >
                                  {savedFields.has(field.key) ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                                      <span>Saved</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      <span>Save</span>
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hero & Story Categories */}
                      {(activeCategory === 'hero' || activeCategory === 'story') && (
                        <div className="space-y-3 sm:space-y-4 w-full">
                          {categoryFields.map(field => (
                            <motion.div key={field.key} variants={itemVariants} className="min-w-0">
                              <FieldEditor
                                field={field}
                                value={getValue(field.key)}
                                onChange={(val) => handleChange(field.key, val)}
                                onSave={() => handleSave(field.key)}
                                isSaving={updateContent.isPending}
                                isSaved={savedFields.has(field.key)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Field Editor Component
function FieldEditor({
  field,
  value,
  onChange,
  onSave,
  isSaving,
  isSaved
}: {
  field: ContentField;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}) {
  return (
    <div className="space-y-1.5 sm:space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={field.key} className="text-xs sm:text-sm font-semibold text-foreground truncate">
          {field.label}
        </Label>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5 px-2 hover:bg-muted shrink-0"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : isSaving ? (
            <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
          ) : (
            <>
              <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </Button>
      </div>
      {field.type === 'textarea' ? (
        <Textarea
          id={field.key}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.key.includes('content') ? 4 : 2}
          className="resize-none text-xs sm:text-sm bg-background border-border/50 focus:border-primary w-full"
        />
      ) : (
        <Input
          id={field.key}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="text-xs sm:text-sm h-9 sm:h-10 bg-background border-border/50 focus:border-primary w-full"
        />
      )}
    </div>
  );
}
