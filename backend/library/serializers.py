from rest_framework import serializers
from .models import BookCategory, Book, LibraryMember, BookIssue
from students.serializers import StudentSerializer

class BookCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Book
        fields = '__all__'

class LibraryMemberSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)

    class Meta:
        model = LibraryMember
        fields = '__all__'

class BookIssueSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    member_name = serializers.CharField(source='member.student.student_first_name', read_only=True)
    member_id_card = serializers.CharField(source='member.student.admission_no', read_only=True)

    class Meta:
        model = BookIssue
        fields = '__all__'
        read_only_fields = ['return_date', 'fine_amount', 'status']

    def validate(self, data):
        if data['book'].available < 1:
            raise serializers.ValidationError("Book is not available for issue.")
        return data
