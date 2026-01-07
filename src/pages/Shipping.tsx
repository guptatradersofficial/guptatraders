
import { Layout } from '@/components/layout/Layout';
import { Truck, Clock, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ShippingPage() {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50/50">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Shipping & Delivery</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We ensure your furniture reaches you safely and on time. Learn about our delivery process, charges, and timelines.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto space-y-12">

                        {/* Key Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <Truck className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Fast Delivery</h3>
                                    <p className="text-gray-600 text-sm">Most orders are delivered within 5-7 business days across major cities.</p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <ShieldCheck className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Safe Handling</h3>
                                    <p className="text-gray-600 text-sm">Expert packaging and handling to ensure your items arrive in perfect condition.</p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                        <Clock className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Scheduled Delivery</h3>
                                    <p className="text-gray-600 text-sm">Choose a delivery slot that works best for you. We value your time.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Policies */}
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="h-6 w-6 text-orange-600" />
                                    <h2 className="text-2xl font-bold text-gray-900">Delivery Areas</h2>
                                </div>
                                <div className="bg-white p-6 rounded-xl border shadow-sm">
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        We currently deliver to most major cities and towns across the region. To check if we deliver to your location, please enter your pincode on the product page.
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-gray-500">
                                            Note: For remote locations or special delivery zones, additional charges may apply. Our customer support team will contact you if this applies to your order.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1" className="px-6">
                                            <AccordionTrigger className="text-left font-medium">How much does shipping cost?</AccordionTrigger>
                                            <AccordionContent className="text-gray-600 pb-4">
                                                Shipping charges vary based on the value of your order and your delivery location. Orders above ₹40,000 usually qualify for free standard shipping. You can view the exact shipping cost at checkout.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2" className="px-6">
                                            <AccordionTrigger className="text-left font-medium">Do you offer assembly services?</AccordionTrigger>
                                            <AccordionContent className="text-gray-600 pb-4">
                                                Yes! For most furniture items like beds, wardrobes, and large tables, we provide free expert assembly at the time of delivery. Our delivery team will set up everything for you.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3" className="px-6">
                                            <AccordionTrigger className="text-left font-medium">What if I'm not home during delivery?</AccordionTrigger>
                                            <AccordionContent className="text-gray-600 pb-4">
                                                Our delivery partner will call you before arriving. If you miss the delivery, we will attempt one more delivery free of charge. You can also reschedule by contacting our support team.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-4" className="px-6 border-b-0">
                                            <AccordionTrigger className="text-left font-medium">Can I change my delivery address?</AccordionTrigger>
                                            <AccordionContent className="text-gray-600 pb-4">
                                                You can change the delivery address before the order is dispatched. Once dispatched, we may not be able to redirect the shipment. Please contact customer support immediately for any changes.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
