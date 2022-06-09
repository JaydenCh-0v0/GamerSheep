#include <windows.h>
#include <cstdio>
#include <fstream>
#include <string>
#include <iostream>
#pragma comment(lib, "Urlmon.lib")

using namespace std;

// Program to download the home page 
// of google.com to a file named 
// myfile.txt. the file can be 
// found in the same working directory 
// from which the project runs 
bool saveUrlImg(const wchar_t* srcURL, const wchar_t* destFile) {
    return S_OK == URLDownloadToFile(NULL, srcURL, destFile, 0, NULL);
}

const wchar_t* str2wchar_t(string str) {
    std::wstring widestr = std::wstring(str.begin(), str.end());
    return _wcsdup(widestr.c_str());
}

string index2destFileName(int index) {
    char c[] = "Books/000.jpg";

    c[6] = '0' + index / 100;
    index %= 100;
    c[7] = '0' + index / 10;
    index %= 10;
    c[8] = '0' + index;

    return string(c);
}

void run() {
    //Initial
    int index = 1;
    const wchar_t* srcURL;
    const wchar_t* destFile;

    //Read from CSV
    ifstream file("URL.txt");
    string str;
    while (getline(file, str))
    {
        srcURL   = str2wchar_t(str);
        destFile = str2wchar_t(index2destFileName(index));
        cout << "Picture(" << index << "): ";
        if (saveUrlImg(srcURL, destFile)) 
            cout << "success\n";
        else 
            cout << "failure\n";
        index++;
    }

    //Complete
    printf("Done!");
}

void test() {
    //Initial
    int index = 1;
    const wchar_t* srcURL;
    const wchar_t* destFile;

    //Read from CSV
    ifstream file("URL.txt");
    string str;
    if (getline(file, str))
    {
        srcURL = str2wchar_t(str);
        cout << str << endl;
        destFile = str2wchar_t(index2destFileName(index));
        cout << "Picture(" << index << "): ";
        if (saveUrlImg(srcURL, destFile))
            cout << "success\n";
        else
            cout << "failure\n";
        index++;
    }

    //Complete
    printf("Done!");
}

int main() {
    run();
    //test();
}