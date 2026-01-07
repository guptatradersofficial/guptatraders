# Developer Reference Guide

## 🎯 Project Overview

This document serves as a developer reference for the About Page & Footer Management system implementation.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Public Pages:              Admin Pages:                │
│  ├─ /about              ├─ /admin/about               │
│  └─ Footer (all)        └─ /admin/footer              │
│                                                           │
├─────────────────────────────────────────────────────────┤
│            State Management (React Query)                │
├─────────────────────────────────────────────────────────┤
│  useAboutContentList()    useFooterItems()             │
│  useUpdateAboutContent()  useCreateFooterItem()        │
│  useAboutContentByKey()   useUpdateFooterItem()        │
│                           useDeleteFooterItem()         │
│                                                           │
├─────────────────────────────────────────────────────────┤
│          Storage & Database (Supabase)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Database Tables:        Storage:                        │
│  ├─ about_content       ├─ site-assets/about/          │
│  └─ footer_items        └─ Images (public)              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 📂 File Organization

### Core Hooks
```
src/hooks/
├── useAboutContent.ts
│   ├── useAboutContentList()      - Fetch all content
│   ├── useUpdateAboutContent()    - Update single field
│   └── useAboutContentByKey()     - Fetch by key
└── useFooterItems.ts              - Already existed
```

### Admin Components
```
src/components/admin/
├── AboutImageUpload.tsx           - Reusable image upload
├── AdminAbout.tsx                 - Main admin page (in pages/)
└── AdminFooter.tsx                - Footer admin (in pages/)
```

### Pages
```
src/pages/
├── About.tsx                      - Public about page
├── admin/
│   ├── AdminAbout.tsx            - Admin about management
│   └── AdminFooter.tsx           - Admin footer management
└── ... existing pages ...
```

### Database
```
supabase/
└── migrations/
    └── 20250103_about_and_footer_content.sql
```

## 🔌 Hook Usage Examples

### Fetching About Content
```tsx
import { useAboutContentList } from '@/hooks/useAboutContent';

function MyComponent() {
  const { data: content = [], isLoading } = useAboutContentList();
  
  const heroTitle = content.find(c => c.section_key === 'hero_title')?.title;
  
  return <div>{heroTitle}</div>;
}
```

### Updating About Content
```tsx
import { useUpdateAboutContent } from '@/hooks/useAboutContent';

function UpdateForm() {
  const updateContent = useUpdateAboutContent();
  
  const handleSave = async () => {
    await updateContent.mutateAsync({
      id: 'some-uuid',
      title: 'New Title'
    });
  };
  
  return (
    <button onClick={handleSave}>
      {updateContent.isPending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Fetching Footer Items
```tsx
import { useFooterItems } from '@/hooks/useFooterItems';

function Footer() {
  const { data: footerItems = [] } = useFooterItems();
  
  const quickLinks = footerItems
    .filter(item => item.section === 'quick_links')
    .sort((a, b) => a.sort_order - b.sort_order);
  
  return (
    <nav>
      {quickLinks.map(item => (
        <a key={item.id} href={item.url}>{item.title}</a>
      ))}
    </nav>
  );
}
```

## 🗄️ Database Schema Reference

### about_content Table
```sql
CREATE TABLE about_content (
  id UUID PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,    -- Identifies the field
  title TEXT,                          -- Main text
  content TEXT,                        -- Long-form content
  image_url TEXT,                      -- Image URL
  sort_order INTEGER DEFAULT 0,        -- Display order
  is_active BOOLEAN DEFAULT TRUE,      -- Visibility
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Data:**
```
section_key: 'hero_title'
title: 'Crafting Beautiful Spaces'
content: NULL
image_url: NULL
sort_order: 1
is_active: true
```

### footer_items Table
```sql
CREATE TABLE footer_items (
  id UUID PRIMARY KEY,
  section TEXT NOT NULL,               -- quick_links|customer_service|about|legal
  title TEXT NOT NULL,                 -- Link text
  url TEXT,                            -- Link URL
  sort_order INTEGER DEFAULT 0,        -- Display order
  is_active BOOLEAN DEFAULT TRUE,      -- Visibility
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Data:**
```
section: 'quick_links'
title: 'Home'
url: '/'
sort_order: 1
is_active: true
```

## 🎨 Component API Reference

### AboutImageUpload Component
```tsx
<AboutImageUpload
  value={currentUrl}                 // Current image URL
  onChange={(url) => setUrl(url)}    // Callback when image uploaded
  label="Profile Photo"              // Optional label
  aspectRatio={1}                    // Optional aspect ratio (default 16/9)
/>
```

**Aspect Ratios Used:**
- `1` - Square (owner_image)
- `4/5` - Vertical (gallery images 1,4)
- `1` - Square (gallery images 2,3)
- `4/3` - Landscape (showroom_main)
- `16/9` - Wide (default)

### FieldEditor Component
```tsx
<FieldEditor
  field={{                           // ContentField object
    key: 'hero_title',
    label: 'Hero Title',
    type: 'text',                    // text|textarea|image
    category: 'hero',
    placeholder: 'Enter title...'
  }}
  value={content}                    // Current value
  onChange={(val) => setValue(val)}  // Change handler
  onSave={() => save()}              // Save handler
  isSaving={isPending}               // Loading state
  isSaved={saved}                    // Success state
/>
```

## 🔐 Security & RLS Policies

### Public Access
```sql
CREATE POLICY "Anyone can read about content"
ON about_content FOR SELECT USING (true);

CREATE POLICY "Anyone can read footer items"  
ON footer_items FOR SELECT USING (true);
```

### Admin Access
```sql
CREATE POLICY "Admins can manage about content"
ON about_content FOR ALL
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage footer items"
ON footer_items FOR ALL
USING (auth.uid() IS NOT NULL);
```

**Note**: Currently checks if user is authenticated. Adjust to check for admin role if needed.

## 🚀 Extending the System

### Adding a New About Section

1. **Define the Field** in AdminAbout.tsx CONTENT_FIELDS:
```tsx
const CONTENT_FIELDS: ContentField[] = [
  { 
    key: 'new_section_title', 
    label: 'New Section Title', 
    type: 'text', 
    category: 'new_category',
    placeholder: '...' 
  },
  // ... more fields
];
```

2. **Add Category** if needed:
```tsx
const CATEGORIES = [
  // ... existing
  { id: 'new_category', label: 'New', icon: SomeIcon, description: '...' },
];
```

3. **Insert Default Data** in migration:
```sql
INSERT INTO about_content (section_key, title, sort_order)
VALUES ('new_section_title', 'Default Title', 20);
```

4. **Display on Public Page** in About.tsx:
```tsx
const newSectionTitle = getContent('new_section_title')?.title;
```

### Adding a New Footer Section

1. **Add Section** to SECTIONS in AdminFooter.tsx:
```tsx
const SECTIONS = [
  // ... existing
  { value: 'new_section', label: 'New Section', description: '...' },
];
```

2. **Create Links** via admin UI or database
3. **Display in Footer** component

## 🧪 Testing Checklist

### Admin About Page
- [ ] Load page `/admin/about`
- [ ] Switch between categories
- [ ] Edit text field and save
- [ ] Edit textarea and save
- [ ] Upload image and save
- [ ] Remove image and save
- [ ] Verify mobile responsive
- [ ] Check animations smooth

### Admin Footer
- [ ] Load page `/admin/footer`
- [ ] Create new link
- [ ] Edit existing link
- [ ] Delete link with confirmation
- [ ] Toggle active/inactive
- [ ] Change sort order
- [ ] Verify sections group correctly
- [ ] Check stats update

### Public Pages
- [ ] Load `/about` page
- [ ] All sections render
- [ ] Images display correctly
- [ ] Content matches admin
- [ ] Responsive on mobile
- [ ] Footer appears and works
- [ ] Links click correctly
- [ ] No console errors

## 🐛 Common Issues & Fixes

### Issue: Images won't upload
**Fix**: Check `site-assets` bucket exists and is public in Supabase Storage

### Issue: Content not saving
**Fix**: Verify database migration ran, check browser console for errors

### Issue: about_content table not found
**Fix**: Run migration script in Supabase SQL Editor

### Issue: Styles look broken
**Fix**: Verify Tailwind CSS is compiled, clear cache (Ctrl+Shift+Delete)

### Issue: Admin pages not accessible
**Fix**: Check routes added to App.tsx, verify authentication working

## 📊 Query Performance Tips

### Optimize Queries
```tsx
// ✅ Good: Fetch once, reuse data
const { data: content } = useAboutContentList();
const hero = content.find(c => c.section_key === 'hero_title');

// ❌ Avoid: Fetch same data multiple times
const { data: hero1 } = useAboutContentByKey('hero_title');
const { data: hero2 } = useAboutContentByKey('hero_title');
```

### Cache Control
```tsx
// React Query automatically caches for 5 minutes
// Force refresh if needed:
queryClient.invalidateQueries({ queryKey: ['about-content'] });
```

## 🔄 Update Cycle

```
User edits in admin
        ↓
onChange fires (local state)
        ↓
Click Save button
        ↓
React Query mutation starts
        ↓
Optimistic update (optional)
        ↓
Supabase update
        ↓
Success callback
        ↓
Cache invalidation
        ↓
Public page auto-refetch
        ↓
New data displayed
```

## 📚 Related Documentation

- **ABOUT_FOOTER_IMPLEMENTATION.md** - Full feature documentation
- **QUICK_SETUP.md** - Setup and deployment guide
- **IMPLEMENTATION_SUMMARY.md** - What was implemented
- **supabase/migrations/** - Database schema

## 🔗 External Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 💬 Code Examples

### Complete Admin Component Example
```tsx
import { useAboutContentList, useUpdateAboutContent } from '@/hooks/useAboutContent';

export function AboutEditor() {
  const { data: content = [], isLoading } = useAboutContentList(true);
  const updateContent = useUpdateAboutContent();
  const [title, setTitle] = useState('');

  useEffect(() => {
    const item = content.find(c => c.section_key === 'hero_title');
    if (item) setTitle(item.title || '');
  }, [content]);

  const handleSave = async () => {
    const item = content.find(c => c.section_key === 'hero_title');
    if (item) {
      await updateContent.mutateAsync({
        id: item.id,
        title: title
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title..."
      />
      <button
        onClick={handleSave}
        disabled={updateContent.isPending}
      >
        {updateContent.isPending ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
```

### Complete Public Component Example
```tsx
import { useAboutContentList } from '@/hooks/useAboutContent';

export function AboutHero() {
  const { data: content = [] } = useAboutContentList();

  const heroTitle = content
    .find(c => c.section_key === 'hero_title')?.title || '';
  
  const heroSubtitle = content
    .find(c => c.section_key === 'hero_subtitle')?.content || '';

  return (
    <section>
      <h1>{heroTitle}</h1>
      <p>{heroSubtitle}</p>
    </section>
  );
}
```

---

**Document Version**: 1.0  
**Last Updated**: January 3, 2026  
**Status**: Production Ready ✅
