import { Card, CardContent } from "@/components/ui/card";

export default function MedicalResources() {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Medical Resources</h2>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Medical professionals discussing patient records */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
            alt="Medical professionals discussing patient records"
            className="rounded-md object-cover h-24 w-full"
          />
          
          {/* Modern doctor's office */}
          <img
            src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
            alt="Modern doctor's office"
            className="rounded-md object-cover h-24 w-full"
          />
          
          {/* Doctors in team meeting */}
          <img
            src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
            alt="Doctors in team meeting"
            className="rounded-md object-cover h-24 w-full"
          />
          
          {/* Medical calendar app on tablet */}
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
            alt="Medical calendar app on tablet"
            className="rounded-md object-cover h-24 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
