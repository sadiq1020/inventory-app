// import React from "react";
// import { PlusCircle, Edit, Trash } from "lucide-react";

// function TransactionActions() {
//   return (
//     <div className="mt-10 flex flex-wrap justify-center gap-4">
//       <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors">
//         <PlusCircle size={18} className="mr-2" />
//         <span>Add Transaction</span>
//       </button>

//       <button className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md shadow-md hover:bg-amber-600 transition-colors">
//         <Edit size={18} className="mr-2" />
//         <span>Modify Transaction</span>
//       </button>

//       <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors">
//         <Trash size={18} className="mr-2" />
//         <span>Delete Transaction</span>
//       </button>
//     </div>
//   );
// }

// export default TransactionActions;

import React from "react";
import { useAuth } from "react-oidc-context";

function TransactionActions() {
  const auth = useAuth();

  const userGroups = auth.user?.profile?.["cognito:groups"] || [];

  const isAdmin = userGroups.includes("Admin");

  return (
    <div className="flex justify-center gap-4 mt-4">
      {isAdmin && (
        <>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Modify Transaction
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete Transaction
          </button>
        </>
      )}
    </div>
  );
}

export default TransactionActions;
