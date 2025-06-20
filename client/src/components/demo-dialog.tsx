"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Info, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Welcome to MarkdownTableMaster",
    description: "Transform your markdown tables into beautiful, customized exports in just a few steps.",
    image: "/demo-welcome.png",
    content: (
      <div className="space-y-4">
        <p>MarkdownTableMaster helps you:</p>
        <ul className="list-none space-y-2">
          {[
            "Convert raw markdown tables to beautiful visualizations",
            "Customize table styles and appearance",
            "Drag and drop to rearrange rows and columns",
            "Export to various formats (PNG, HTML, CSS)",
          ].map((item, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Step 1: Input Your Markdown",
    description: "Paste your markdown table text or use our sample table to get started.",
    image: "/demo-step-1.png",
    content: (
      <div className="space-y-4">
        <p>The left panel accepts standard markdown table syntax:</p>
        <div className="bg-slate-100 p-3 rounded-md text-sm font-mono whitespace-pre overflow-auto text-slate-800">
          {`| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |`}
        </div>
        <p className="text-sm text-slate-600">
          <Info className="inline h-4 w-4 mr-1" />
          Don't have a table ready? The app automatically loads a sample table to help you get started.
        </p>
      </div>
    ),
  },
  {
    title: "Step 2: Customize Your Table",
    description: "Use style controls to personalize the appearance of your table.",
    image: "/demo-step-2.png",
    content: (
      <div className="space-y-4">
        <p>Customize your table with various styling options:</p>
        <ul className="list-none space-y-2">
          {[
            "Apply different themes with a single click",
            "Adjust border styles, colors, and thickness",
            "Customize header and alternating row colors",
            "Control text alignment and typography",
          ].map((item, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Step 3: Rearrange Content",
    description: "Drag and drop rows or columns to reorder your table data.",
    image: "/demo-step-3.png",
    content: (
      <div className="space-y-4">
        <p>Our interactive table preview allows you to:</p>
        <ul className="list-none space-y-2">
          {[
            "Drag rows up or down to change their order",
            "Drag columns left or right to reposition them",
            "See your changes instantly reflected in the preview",
            "Your markdown code updates automatically when you rearrange",
          ].map((item, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Step 4: Export Your Table",
    description: "Save your beautifully styled table in your preferred format.",
    image: "/demo-step-4.png",
    content: (
      <div className="space-y-4">
        <p>Export your table in multiple formats:</p>
        <ul className="list-none space-y-2">
          {[
            "PNG image for presentations or documentation",
            "HTML code to embed in web pages",
            "CSS code to match your application's style",
            "Copy formatted markdown to use elsewhere",
          ].map((item, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export function DemoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const step = steps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <p className="text-muted-foreground mt-1.5">{step.description}</p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Demo Content - changes based on current step */}
          <div className="bg-white rounded-lg p-4 order-2 md:order-1">
            {step.content}
          </div>
            {/* Demo Image */}
          <div className="bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center order-1 md:order-2 h-[230px] relative">
            <img 
              src={step.image} 
              alt={`Demo for ${step.title}`}
              className="object-contain max-w-full max-h-full"
            />
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors", 
                currentStep === index ? "bg-primary" : "bg-slate-200"
              )}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          
          <Button
            onClick={isLastStep ? () => onOpenChange(false) : nextStep}
          >
            {isLastStep ? "Get Started" : (
              <>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
