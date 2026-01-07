
import { Layout } from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: "Orders & Tracking",
            questions: [
                { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order in the 'My Profile' section under 'Orders'." },
                { q: "Can I cancel my order?", a: "Yes, you can cancel your order before it has been dispatched. Go to 'My Orders', select the order, and click 'Cancel'. If the order is already shipped, you may need to initiate a return after delivery." },
                { q: "Do you take bulk orders?", a: "Yes, we accept bulk orders for offices, hotels, and institutions. Please contact our support team or use the Contact Us form for a custom quote." }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                { q: "What are the shipping charges?", a: "Shipping is free for orders above ₹40,000. For orders below this amount, a nominal shipping fee is calculated at checkout based on your location and product weight." },
                { q: "Do you deliver internationally?", a: "Currently, we only deliver within India. We are working on expanding our delivery network to international locations soon." },
                { q: "What happens if I receive a damaged product?", a: "We have a strict quality check process, but if you receive a damaged item, please report it within 48 hours of delivery with photos. we will arrange a replacement or refund immediately." }
            ]
        },

        {
            category: "Product & Care",
            questions: [
                { q: "Is there a warranty on furniture?", a: "Yes, all our furniture comes with a standard 12-month warranty against manufacturing defects. Some premium items may have an extended warranty period." },
                { q: "How do I clean my wooden furniture?", a: "Use a soft, dry cloth for daily dusting. Avoid direct sunlight and moisture. For deep cleaning, use a mild wood cleaner and polish once every few months." }
            ]
        }
    ];

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
                            Find answers to common questions about our products, shipping, and services.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Input
                                type="text"
                                placeholder="Search for a question..."
                                className="pl-12 h-12 text-lg shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((category, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
                                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.questions.map((faq, qIdx) => (
                                                <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="px-6 last:border-b-0">
                                                    <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                                                        {faq.q}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No matching questions found.</p>
                                <Button
                                    variant="link"
                                    className="mt-2"
                                    onClick={() => setSearchQuery('')}
                                >
                                    Clear search
                                </Button>
                            </div>
                        )}

                        {/* Still need help? */}
                        <div className="bg-orange-50 rounded-2xl p-8 text-center space-y-4 border border-orange-100">
                            <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                <MessageCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Still need help?</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Can't find the answer you're looking for? Please chat to our friendly team.
                            </p>
                            <div className="pt-2">
                                <Button className="bg-orange-600 hover:bg-orange-700">Contact Support</Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
