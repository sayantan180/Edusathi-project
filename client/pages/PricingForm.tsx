import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, ArrowLeft, ArrowRight, GraduationCap, Building, Globe, CreditCard } from 'lucide-react';

interface FormData {
  brandName: string;
  ownerName: string;
  domainName: string;
  email: string;
  phone: string;
  selectedPlan: {
    name: string;
    price: number;
    billing: 'monthly' | 'annual';
  };
}

export default function PricingForm() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    ownerName: '',
    domainName: '',
    email: '',
    phone: '',
    selectedPlan: {
      name: searchParams.get('plan') || 'Professional',
      price: parseInt(searchParams.get('price') || '79'),
      billing: (searchParams.get('billing') as 'monthly' | 'annual') || 'monthly'
    }
  });

  const totalSteps = 3;
  const stepTitles = [
    'Institute Details',
    'Owner Information', 
    'Review & Payment'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create payment order
      const orderData = {
        amount: formData.selectedPlan.price * 100, // Razorpay expects amount in paise
        currency: 'USD',
        institute: formData.brandName,
        owner: formData.ownerName,
        email: formData.email,
        plan: formData.selectedPlan.name
      };

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await response.json();

      if (!order.success) {
        throw new Error(order.error || 'Failed to create order');
      }

      // Get Razorpay config
      const configResponse = await fetch('/api/payment/config');
      const config = await configResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: config.key_id,
        amount: order.order.amount,
        currency: order.order.currency,
        name: 'Edusathi',
        description: `${formData.selectedPlan.name} Plan - ${formData.brandName}`,
        order_id: order.order.id,
        prefill: {
          name: formData.ownerName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verification = await verifyResponse.json();

            if (verification.success) {
              alert('Payment successful! Your institute is being set up.');
              // Redirect to dashboard or success page
              window.location.href = '/dashboard';
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed');
          },
        },
      };

      // Load Razorpay script and open checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.brandName.trim() !== '' && formData.domainName.trim() !== '';
      case 2:
        return formData.ownerName.trim() !== '' && formData.email.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Edusathi</span>
          </Link>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Setup Your Institute</h1>
            <span className="text-sm text-slate-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, index) => (
              <span
                key={index}
                className={`text-xs ${
                  index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-slate-400'
                }`}
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {stepTitles[currentStep - 1]}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about your institute and choose your domain"}
                  {currentStep === 2 && "We need some details about the institute owner"}
                  {currentStep === 3 && "Review your details and proceed to payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Institute Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="brandName">Institute/Brand Name *</Label>
                      <Input
                        id="brandName"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                        placeholder="e.g. ABC Institute of Technology"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="domainName">Preferred Domain Name *</Label>
                      <div className="flex mt-1">
                        <Input
                          id="domainName"
                          value={formData.domainName}
                          onChange={(e) => handleInputChange('domainName', e.target.value)}
                          placeholder="your-institute"
                          className="rounded-r-none"
                        />
                        <div className="bg-slate-100 border border-l-0 rounded-r-md px-3 py-2 text-sm text-slate-600">
                          .edusathi.com
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        This will be your institute's web address
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Owner Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="ownerName">Owner/Director Full Name *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="e.g. Dr. John Smith"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="director@yourinstitute.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Institute Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Institute Name:</span>
                          <span className="font-medium">{formData.brandName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Domain:</span>
                          <span className="font-medium">{formData.domainName}.edusathi.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Owner:</span>
                          <span className="font-medium">{formData.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Selected Plan</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Plan:</span>
                          <Badge className="bg-blue-600">{formData.selectedPlan.name}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Billing:</span>
                          <span className="font-medium capitalize">{formData.selectedPlan.billing}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Amount:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ${formData.selectedPlan.price}/{formData.selectedPlan.billing === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600"
                    >
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{formData.selectedPlan.name} Plan</h3>
                    <p className="text-sm text-slate-600">
                      {formData.selectedPlan.billing === 'monthly' ? 'Monthly' : 'Annual'} billing
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${formData.selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Setup Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">${formData.selectedPlan.price}</span>
                </div>

                <div className="bg-green-50 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check className="w-4 h-4" />
                    <span>14-day free trial included</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
