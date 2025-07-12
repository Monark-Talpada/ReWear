import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
const NoData = ({ message, icon: Icon = Inbox }) => (
  <Card className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
    <Icon className="w-12 h-12 mb-4" />
    <p className="text-sm">{message}</p>
  </Card>
);
export default NoData;
