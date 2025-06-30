import { Card, CardContent } from "@mui/material";

const ServiceCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <Card
      className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 h-full"
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent className="p-8 text-center h-full">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
