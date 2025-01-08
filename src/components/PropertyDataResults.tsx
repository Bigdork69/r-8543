import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface PropertyData {
  address: string;
  floor_area_sq_ft: number | null;
  habitable_rooms: number;
  inspection_date: string;
}

interface PropertyDataResultsProps {
  data: PropertyData[] | null;
  isLoading: boolean;
  error: string | null;
}

const PropertyDataResults = ({ data, isLoading, error }: PropertyDataResultsProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PropertyData;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortData = (key: keyof PropertyData) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!data || !sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-estate-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-estate-600">
        <p>No floor area data is available for the provided postcode. Please try another one.</p>
      </div>
    );
  }

  const sortedData = getSortedData();

  return (
    <div className="w-full mt-32 px-4 md:px-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-estate-100 sticky top-0">
              <TableRow>
                <TableHead 
                  className="text-estate-800 font-semibold cursor-pointer hover:bg-estate-200 transition-colors"
                  onClick={() => sortData('address')}
                >
                  Address
                  <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
                <TableHead 
                  className="text-right text-estate-800 font-semibold cursor-pointer hover:bg-estate-200 transition-colors"
                  onClick={() => sortData('floor_area_sq_ft')}
                >
                  Floor Area (Square Feet)
                  <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
                <TableHead 
                  className="text-right text-estate-800 font-semibold cursor-pointer hover:bg-estate-200 transition-colors"
                  onClick={() => sortData('habitable_rooms')}
                >
                  Habitable Rooms
                  <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
                <TableHead 
                  className="text-right text-estate-800 font-semibold cursor-pointer hover:bg-estate-200 transition-colors"
                  onClick={() => sortData('inspection_date')}
                >
                  Inspection Date
                  <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData?.map((property, index) => (
                <TableRow 
                  key={`${property.address}-${index}`}
                  className={`
                    cursor-pointer 
                    hover:bg-estate-50 
                    transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-estate-100/30'}
                  `}
                  onClick={() => console.log('Property selected:', property)}
                >
                  <TableCell className="font-medium text-estate-800">{property.address}</TableCell>
                  <TableCell className="text-right text-estate-700">
                    {property.floor_area_sq_ft ? property.floor_area_sq_ft.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right text-estate-700">{property.habitable_rooms}</TableCell>
                  <TableCell className="text-right text-estate-700">
                    {format(new Date(property.inspection_date), 'yyyy-MM-dd')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PropertyDataResults;