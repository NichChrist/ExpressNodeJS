const responseMessageConstant = {
    EMAIL_VERIFIED_TRUE: 1,
    EMAIL_VERIFIED_FALSE: 0,
    STATUS_ACTIVE: 1,
    STATUS_INACTIVE: 0,
    STATUS_REMOVED: 2,
    EMAIL_200_FOUND: 'Email Found',
    EMAIL_400_TAKEN: 'Email Taken',
    EMAIL_404_NOT_FOUND: 'Email Not Found',
    EMAIL_422_EMPTY: '"Email" is not allowed to be empty',
    EMAIL_422_INVALID_FORMAT: '"Email" must be in a valid email format',

    USERNAME_200_FOUND: 'Username Found',
    USERNAME_400_TAKEN: 'Username Taken',
    USERNAME_404_NOT_FOUND: 'Username Not Found',
    USERNAME_422_EMPTY: '"Username" is not allowed to be empty',
    USERNAME_422_INVALID_FORMAT: '"Username" must be in a valid username format (No Spaces)',

    PHONENUMBER_200_FOUND: 'Phone number Found',
    PHONENUMBER_400_TAKEN: 'Phone number Taken',
    PHONENUMBER_404_NOT_FOUND: 'Phone number Not Found',
    PHONENUMBER_422_EMPTY: '"Phone number" is not allowed to be empty',
    PHONENUMBER_422_INVALID_FORMAT: '"Phone number" must be in a valid phone number format (No Spaces)',

    NAME_200_FOUND: 'Name Found',
    NAME_400_TAKEN: 'Name Taken',
    NAME_404_NOT_FOUND: 'Name Not Found',
    NAME_422_EMPTY: '"Name" is not allowed to be empty',
    NAME_422_INVALID_FORMAT: '"Name" must be in a valid name format',

    ID_422_INVALID_FORMAT: '"id" must be in a valid UUID format',

    IS_ACTIVE_422_INVALID_VALUE: '"is_active" must be boolean',

    LOGIN_200_SUCCESS: 'Login Successful',
    LOGIN_400_INCORRECT_EMAIL_OR_PASS: 'Incorrect Email or Password',

    OLD_PASSWORD_400_INCORRECT: 'Incorrect Old Password',

    PASSWORD_200_UPDATE_SUCCESS: '"Password" updated successfully',
    PASSWORD_400_UPDATE_FAILED: '"Password" update failed',
    PASSWORD_422_EMPTY: '"Password" is not allowed to be empty',
    PASSWORD_422_INVALID_FORMAT: '"Password" must be at least 8 characters, alphanumeric, at least 1 lowercase and at least 1 uppercase',

    PASSWORD_CONFIRMATION_422_NOT_MATCHING: '"Password" and "Confirmation Password" does not match',

    TOKEN_404_NOT_FOUND: 'Token Not Found',

    USER_200_DELETED: 'Successfully Deleted A Single User',
    USER_200_FETCHED_ALL: 'Successfully Fetched All Users',
    USER_200_FETCHED_SINGLE: 'Successfully Fetched A Single User',
    USER_200_UPDATED: 'Successfully Updated A Single User',
    USER_201_REGISTERED: 'Successfully Registered The User',
    USER_404_NOT_FOUND: 'User Not Found',

    OUTLET_200_DELETED: 'Successfully Deleted A Single Outlet',
    OUTLET_200_FETCHED_ALL: 'Successfully Fetched All Outlets',
    OUTLET_200_FETCHED_SINGLE: 'Successfully Fetched A Single Outlet',
    OUTLET_200_UPDATED: 'Successfully Updated A Single Outlet',
    OUTLET_201_REGISTERED: 'Successfully Registered The Outlet',
    OUTLET_404_NOT_FOUND: 'Outlet Not Found',

    MODEL_200_DELETED: 'Successfully Deleted A Single Model',
    MODEL_200_FETCHED_ALL: 'Successfully Fetched All Models',
    MODEL_200_FETCHED_SINGLE: 'Successfully Fetched A Single Model',
    MODEL_200_UPDATED: 'Successfully Updated A Single Model',
    MODEL_201_REGISTERED: 'Successfully Registered The Model',
    MODEL_404_NOT_FOUND: 'Model Not Found',

    INGREDIENT_200_DELETED: 'Successfully Deleted A Single Ingredient',
    INGREDIENT_200_FETCHED_ALL: 'Successfully Fetched All Ingredients',
    INGREDIENT_200_FETCHED_SINGLE: 'Successfully Fetched A Single Ingredient',
    INGREDIENT_200_UPDATED: 'Successfully Updated A Single Ingredient',
    INGREDIENT_201_REGISTERED: 'Successfully Registered The Ingredient',
    INGREDIENT_404_NOT_FOUND: 'Ingredient Not Found',

    ProductCategory_200_DELETED: 'Successfully Deleted A Single Product Category',
    ProductCategory_200_FETCHED_ALL: 'Successfully Fetched All Product Categories',
    ProductCategory_200_FETCHED_SINGLE: 'Successfully Fetched A Single Product Category',
    ProductCategory_200_UPDATED: 'Successfully Updated A Single Product Category',
    ProductCategory_201_REGISTERED: 'Successfully Registered The Product Category',
    ProductCategory_404_NOT_FOUND: 'Product Category Not Found',

    Product_200_DELETED: 'Successfully Deleted A Single Product',
    Product_200_FETCHED_ALL: 'Successfully Fetched All Products',
    Product_200_FETCHED_SINGLE: 'Successfully Fetched A Single Product',
    Product_200_UPDATED: 'Successfully Updated A Single Product',
    Product_201_REGISTERED: 'Successfully Registered The Product',
    Product_201_BULK_REGISTERED: 'Successfully Registered Many The Product(s)',
    Product_404_NOT_FOUND: 'Product  Not Found',

    PRODUCT_201_CREATED: 'Successfully Created The Product',
    PRODUCT_CODE_400_TAKEN: 'Product Code Taken',
    PRODUCT_200_FETCHED_ALL: 'Successfully Fetched All Products',
    PRODUCT_200_FETCHED_SINGLE: 'Successfully Fetched A Single Product',
    PRODUCT_200_UPDATED: 'Successfully Updated A Single Product',
    PRODUCT_200_DELETED: 'Successfully Deleted A Single Product',
    PRODUCT_404_NOT_FOUND: 'Product Not Found',

    HTTP_401_UNAUTHORIZED: 'Please Authenticate',
    HTTP_403_FORBIDDEN: 'You Have No Permission',
    HTTP_502_BAD_GATEWAY: 'Something Went Wrong',
}

export { responseMessageConstant };
